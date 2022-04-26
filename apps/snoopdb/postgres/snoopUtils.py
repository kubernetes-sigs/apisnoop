import os
import json
from urllib.request import urlopen, urlretrieve
from string import Template
import requests
import re
from copy import deepcopy
from functools import reduce
from collections import defaultdict
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import subprocess
import warnings
from tempfile import mkdtemp
import time
import glob

AUDIT_KIND_CONFORMANCE_RUNS="https://prow.k8s.io/job-history/kubernetes-jenkins/logs/ci-audit-kind-conformance"
GCS_LOGS="https://storage.googleapis.com/kubernetes-jenkins/logs/"
DEFAULT_BUCKET="ci-kubernetes-gci-gce"
K8S_GITHUB_RAW= "https://raw.githubusercontent.com/kubernetes/kubernetes/"

IGNORED_PATHS=[
    'metrics',
    'readyz',
    'livez',
    'healthz',
    'example.com',
    'kope.io',
    'snapshot.storage.k8s.io',
    'metrics.k8s.io',
    'wardle.k8s.io'
]

#TESTED
def assign_verb_to_method (verb, uri):
    """Assigns audit event verb to apropriate method for generating opID later.
       Accounts for irregular behaviour with head and option verbs."""
    methods_and_verbs={
        'get': ['get','list','watch'],
        'proxy': ['proxy'],
        'options': [''],
        'post': ['create','post'],
        'put': ['update','put'],
        'patch': ['patch'],
        'connect': ['connect'],
        'delete': ['delete','delete_collection']
    }

    if verb == 'get' and uri.endswith('HEAD'):
        return 'head'

    for key, value in methods_and_verbs.items():
        if verb in value:
            return key
    return None

def get_json(url):
    """Given a json url path, return json as dict"""
    body = urlopen(url).read()
    data = json.loads(body)
    return data

def get_html(url):
    """return html content of given url"""
    html = urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    return soup

#TESTED
def is_spyglass_script(tag):
    return tag.name == 'script' and not tag.has_attr('src') and ('allBuilds' in tag.contents[0])

#TESTED
def get_latest_akc_success(soup):
    """
    determines latest successful run for ci-audit-kind-conformance and returns its ID as a string.
    """
    scripts = soup.find(is_spyglass_script)
    if scripts is None :
        raise ValueError("No spyglass script found in akc page")
    try:
        builds = json.loads(scripts.contents[0].split('allBuilds = ')[1][:-2])
    except Exception as e:
        raise ValueError("Could not load json from build data. is it valid json?", e)
    try:
        latest_success = [b for b in builds if b['Result'] == 'SUCCESS'][0]
    except Exception as e:
        raise ValueError("Cannot find success in builds")
    return latest_success['ID']

# TESTING NOT NECESSARY
def determine_bucket_job(custom_bucket=None, custom_job=None):
    """return tuple of bucket, job, using latest successful job of default bucket if no custom bucket or job is given"""
    #establish bucket we'll draw test results from.
    baseline_bucket = os.environ['APISNOOP_BASELINE_BUCKET'] if 'APISNOOP_BASELINE_BUCKET' in os.environ.keys() else 'ci-kubernetes-e2e-gci-gce'
    bucket =  baseline_bucket if custom_bucket is None else custom_bucket
    if bucket == 'ci-audit-kind-conformance':
        html = get_html(AUDIT_KIND_CONFORMANCE_RUNS)
        latest_success = get_latest_akc_success(html)
        job = latest_success if custom_job is None else custom_job
    else:
        #grab the latest successful test run for our chosen bucket.
        testgrid_history = get_json(GCS_LOGS + bucket + "/jobResultsCache.json")
        latest_success = [x for x in testgrid_history if x['result'] == 'SUCCESS'][-1]['buildnumber']
        #establish job
        baseline_job = os.environ['APISNOOP_BASELINE_JOB'] if 'APISNOOP_BASELINE_JOB' in os.environ.keys() else latest_success
        job = baseline_job if custom_job is None else custom_job
    return (bucket, job)

# TESTED
def merge_into(d1, d2):
    for key in d2:
        if key not in d1 or not isinstance(d1[key], dict):
            d1[key] = deepcopy(d2[key])
        else:
            d1[key] = merge_into(d1[key], d2[key])
    return d1

# TESTED
def deep_merge(*dicts, update=False):
    if update:
        return reduce(merge_into, dicts[1:], dicts[0])
    else:
        return reduce(merge_into, dicts, {})

# NOT TESTING
def download_url_to_path(url, local_path, dl_dict):
    """
    downloads contents to local path, creating path if needed,
    then updates given downloads dict.
    """
    local_dir = os.path.dirname(local_path)
    if not os.path.isdir(local_dir):
        os.makedirs(local_dir)
    if not os.path.isfile(local_path):
        process = subprocess.Popen(['wget', '-q', url, '-O', local_path])
        dl_dict[local_path] = process

# NOT TESTING
def get_all_auditlog_links(au):
    """
    given an artifacts url, au, return a list of all
    audit.log.* within it.
    (some audit.logs end in .gz)
    """
    soup = get_html(au)
    master_link = soup.find(href=re.compile("master"))
    master_soup = get_html("https://gcsweb.k8s.io" + master_link['href'])
    return master_soup.find_all(href=re.compile("audit.log"))

# NOT TESTING
def get_all_audit_kind_links(au):
    """
    grab all the audit logs from our ci-audit-kind-conformance bucket,
    since their names and locations are non-standard
    """
    soup = get_html(au)
    print(soup.find_all(href=re.compile(".log")))
    return soup.find_all(href=re.compile(".log"))

# TESTED
def load_openapi_spec(url):
    cache=defaultdict(dict)
    openapi_spec = {}
    openapi_spec['hit_cache'] = {}
    swagger = requests.get(url).json()
    for path in swagger['paths']:
        path_parts = path.strip("/").split("/")
        path_len = len(path_parts)
        last_part = None
        last_level = None
        path_dict = {}
        current_level = path_dict
        for part in path_parts:
            if part not in current_level:
                current_level[part] = {}
                current_level = current_level[part]
        for method, swagger_method in swagger['paths'][path].items():
            if method == 'parameters':
                next
            else:
                current_level[method]=swagger_method.get('operationId', '')
                cache = deep_merge(cache, {path_len:path_dict})
                openapi_spec['cache'] = cache
    return openapi_spec

#TESTED
def format_uri_parts_for_proxy(uri_parts):
    formatted_parts=uri_parts[0:uri_parts.index('proxy')+1]
    proxy_tail = uri_parts[uri_parts.index('proxy')+1:]
    if len(proxy_tail):
        formatted_parts.append('/'.join(proxy_tail))
    return formatted_parts

# TODO create proper regex to find namespace status versus namespace resource status
# TESTED
def is_namespace_status(uri_parts):
    if len(uri_parts) != 5:
        return False
    return uri_parts[2] == 'namespaces' and uri_parts[-1] == 'status'

# TESTED
def format_uri_parts_for_namespace_status(uri_parts):
    # in the open api spec, the namespace endpoints
    # are listed differently from other endpoints.
    # it abstracts the specific namespace to just {name}
    # so if you hit /api/v1/namespaces/something/cool/status
    # it shows in the spec as api.v1.namespaces.{name}.status
    uri_first_half = uri_parts[:3]
    uri_second_half =['{name}','status']
    return uri_first_half + uri_second_half

# TESTED
def is_namespace_finalize(uri_parts):
    if len(uri_parts) != 5:
        return False
    return uri_parts[2] == 'namespaces' and uri_parts[-1] == 'finalize'

# TESTED
def format_uri_parts_for_namespace_finalize(uri_parts):
    # Using the same logic as status, but I am uncertain
    # all the various finalize endpoints, so this may not
    # pick them all up.  Revisit if so!
    uri_first_half = uri_parts[:3]
    uri_second_half =['{name}','finalize']
    return uri_first_half + uri_second_half

def format_uri_parts(path):
  uri_parts = path.strip('/').split('/')
  if 'proxy' in uri_parts:
    uri_parts = format_uri_parts_for_proxy(uri_parts)
  elif is_namespace_status(uri_parts):
      uri_parts = format_uri_parts_for_namespace_status(uri_parts)
  elif is_namespace_finalize(uri_parts):
      uri_parts = format_uri_parts_for_namespace_finalize(uri_parts)
  return uri_parts

def is_ignored_endpoint(uri_parts):
    if any(part in uri_parts for part in IGNORED_PATHS):
        return True
    if uri_parts == ['openapi','v2']:
        return True
    return False

# given an open api spec and audit event, returns operation id and an error.
# If the opID can be found in the spec,
# then we return it with a nil error.
# Otherwise, we return a nilID and a given error message.
# we add both op id and error to our events,
# so that we can parse events by error in snoopdb
def find_operation_id(openapi_spec, event):
  method=assign_verb_to_method(event['verb'], event['requestURI'])
  if method is None:
      return None, "Could not assign a method from the event verb. Check the event.verb."
  url = urlparse(event['requestURI'])
  if url.path in openapi_spec['hit_cache']:
    if method in openapi_spec['hit_cache'][url.path].keys():
      return openapi_spec['hit_cache'][url.path][method], None
  uri_parts = format_uri_parts(url.path)
  part_count = len(uri_parts)
  if part_count in openapi_spec['cache']:
      cache = openapi_spec['cache'][part_count]
  else:
      return None, "part count too high, and not found in open api spec. Check the event's request URI"
  if is_ignored_endpoint(uri_parts):
      return None, 'This is a known dummy endpoint and can be ignored. See the requestURI for more info.'
  last_part = None
  last_level = None
  current_level = cache
  for idx in range(part_count):
    part = uri_parts[idx]
    last_level = current_level
    if part in current_level:
      current_level = current_level[part]
    elif idx == part_count-1:
      variable_levels=[x for x in current_level.keys() if '{' in x]
      if not variable_levels:
        return None, "We have not seen this type of event before, and it is not in spec. Check its request uri"
      variable_level=variable_levels[0]
      if variable_level in current_level:
          current_level = current_level[variable_level]
      else:
          return None, "Cannot find variable level in open api spec. Check the requestURI for more info"
    else:
      next_part = uri_parts[idx+1]
      variable_levels=[x for x in current_level.keys() if '{' in x]
      if not variable_levels:
        return None, "We have not seen this type of event before, and it is not in spec. Check its request uri"
      next_level=variable_levels[0]
      current_level = current_level[next_level]
  if method in current_level:
      op_id = current_level[method]
  else:
      return None, "Could not find operation for given method. Check the requestURI and the method."
  if url.path not in openapi_spec['hit_cache']:
    openapi_spec['hit_cache'][url.path]={method:op_id}
  else:
    openapi_spec['hit_cache'][url.path][method]=op_id
  return op_id, None

def download_and_process_auditlogs(bucket,job):
    """
    Grabs all audits logs available for a given bucket/job, combines them into a
    single audit log, then returns the path for where the raw combined audit logs are stored.
    The processed logs are in json, and include the operationId when found.
    """
    # BUCKETS_PATH = 'https://storage.googleapis.com/kubernetes-jenkins/logs/'
    ARTIFACTS_PATH ='https://gcsweb.k8s.io/gcs/kubernetes-jenkins/logs/'
    K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
    downloads = {}
    # bucket_url = BUCKETS_PATH + bucket + '/' + job + '/'
    download_path = mkdtemp( dir='/tmp', prefix='apisnoop-' + bucket + '-' + job ) + '/'
    combined_log_file = download_path + 'combined-audit.log'
    if bucket == 'ci-audit-kind-conformance':
        commit_hash = 'master'
    else: 
        metadata_url = ''.join([GCS_LOGS, bucket, '/', job, '/finished.json'])
        print('FINISHED.JSON: ', urlopen(metadata_url).read().decode('utf-8'))
        metadata = json.loads(urlopen(metadata_url).read().decode('utf-8'))
        commit_hash = metadata["version"].split("+")[1]

    # download all logs
    if bucket == 'ci-audit-kind-conformance':
        artifacts_url = ARTIFACTS_PATH + bucket + '/' +  job + '/' + 'artifacts/audit'
        log_links = get_all_audit_kind_links(artifacts_url)
    else:
        artifacts_url = ARTIFACTS_PATH + bucket + '/' +  job + '/' + 'artifacts'
        log_links = get_all_auditlog_links(artifacts_url)
    for link in log_links:
        log_url = link['href']
        log_file = download_path + os.path.basename(log_url)
        download_url_to_path( log_url, log_file, downloads)

    # Our Downloader uses subprocess of curl for speed
    for download in downloads.keys():
        # Sleep for 5 seconds and check for next download
        while downloads[download].poll() is None:
            time.sleep(5)

    # Loop through the files, (z)cat them into a combined audit.log
    with open(combined_log_file, 'ab') as log:
        glob_pattern = 'audit*log' if bucket == 'ci-audit-kind-conformance' else '*kube-apiserver-audit*'
        for logfile in sorted(glob.glob(download_path + glob_pattern), reverse=True):
            if logfile.endswith('z'):
                subprocess.run(['zcat', logfile], stdout=log, check=True)
            else:
                subprocess.run(['cat', logfile], stdout=log, check=True)

    # Process the resulting combined raw audit.log by adding operationId
    swagger_url = K8S_GITHUB_REPO + commit_hash + '/api/openapi-spec/swagger.json'
    openapi_spec = load_openapi_spec(swagger_url)
    infilepath=combined_log_file
    outfilepath=combined_log_file+'+opid'
    with open(infilepath) as infile:
        with open(outfilepath,'w') as output:
            for line in infile.readlines():
                event = json.loads(line)
                opId, err = find_operation_id(openapi_spec,event)
                event['operationId'] = opId
                event['snoopError'] = err
                output.write(json.dumps(event)+'\n')
    return outfilepath
