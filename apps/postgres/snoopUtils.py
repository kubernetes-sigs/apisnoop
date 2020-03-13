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

GCS_LOGS="https://storage.googleapis.com/kubernetes-jenkins/logs/"
DEFAULT_BUCKET="ci-kubernetes-gci-gce"
K8S_GITHUB_RAW= "https://raw.githubusercontent.com/kubernetes/kubernetes/"

def get_json(url):
    """Given a json url path, return json as dict"""
    body = urlopen(url).read()
    data = json.loads(body)
    return data

def determine_bucket_job(custom_bucket=None, custom_job=None):
    """return tuple of bucket, job, using latest succesfful job of default bucket if no custom bucket or job is given"""
    #establish bucket we'll draw test results from.
    baseline_bucket = os.environ['APISNOOP_BASELINE_BUCKET'] if 'APISNOOP_BASELINE_BUCKET' in os.environ.keys() else 'ci-kubernetes-e2e-gci-gce'
    bucket =  baseline_bucket if custom_bucket is None else custom_bucket
    #grab the latest successful test run for our chosen bucket.
    testgrid_history = get_json(GCS_LOGS + bucket + "/jobResultsCache.json")
    latest_success = [x for x in testgrid_history if x['result'] == 'SUCCESS'][-1]['buildnumber']
    #establish job
    baseline_job = os.environ['APISNOOP_BASELINE_JOB'] if 'APISNOOP_BASELINE_JOB' in os.environ.keys() else latest_success
    job = baseline_job if custom_job is None else custom_job
    return (bucket, job)

def fetch_swagger(bucket, job):
    """fetches swagger for given bucket and job and returns it, and its appropariate metadata, in a dict"""
    metadata_url = ''.join([GCS_LOGS, bucket, '/', job, '/finished.json'])
    metadata = json.loads(urlopen(metadata_url).read().decode('utf-8'))
    commit_hash = metadata["version"].split("+")[1]
    swagger_url =  ''.join([K8S_GITHUB_RAW, commit_hash, '/api/openapi-spec/swagger.json'])
    swagger = json.loads(urlopen(swagger_url).read().decode('utf-8')) # may change this to ascii
    return (swagger, metadata, commit_hash);

def merge_into(d1, d2):
    for key in d2:
        if key not in d1 or not isinstance(d1[key], dict):
            d1[key] = deepcopy(d2[key])
        else:
            d1[key] = merge_into(d1[key], d2[key])
    return d1

def deep_merge(*dicts, update=False):
    if update:
        return reduce(merge_into, dicts[1:], dicts[0])
    else:
        return reduce(merge_into, dicts, {})



def get_html(url):
    """return html content of given url"""
    html = urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    return soup

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

def load_openapi_spec(url):
    cache=defaultdict(dict)
    openapi_spec = {}
    openapi_spec['hit_cache'] = {}
    swagger = requests.get(url).json()
    for path in swagger['paths']:
        path_data = {}
        path_parts = path.strip("/").split("/")
        path_len = len(path_parts)
        path_dict = {}
        last_part = None
        last_level = None
        current_level = path_dict
        for part in path_parts:
            if part not in current_level:
                current_level[part] = {}
                last_part=part
                last_level = current_level
                current_level = current_level[part]
        for method, swagger_method in swagger['paths'][path].items():
            if method == 'parameters':
                next
            else:
                current_level[method]=swagger_method.get('operationId', '')
                cache = deep_merge(cache, {path_len:path_dict})
                openapi_spec['cache'] = cache
    return openapi_spec

def find_operation_id(openapi_spec, event):
  verb_to_method={
    'get': 'get',
    'list': 'get',
    'proxy': 'proxy',
    'create': 'post',
    'post':'post',
    'put':'post',
    'update':'put',
    'patch':'patch',
    'connect':'connect',
    'delete':'delete',
    'deletecollection':'delete',
    'watch':'get'
  }
  method=verb_to_method[event['verb']]
  url = urlparse(event['requestURI'])
  # 1) Cached seen before results
  if url.path in openapi_spec['hit_cache']:
    if method in openapi_spec['hit_cache'][url.path].keys():
      return openapi_spec['hit_cache'][url.path][method]
  uri_parts = url.path.strip('/').split('/')
  if 'proxy' in uri_parts:
      # All parts up to proxy
      z=uri_parts[0:uri_parts.index('proxy')]
      # proxy is a single part of the uri_parts
      z.append('proxy')
      # However all parameters after that are another single argument
      # to the proxy
      z.append('/'.join(uri_parts[uri_parts.index('proxy')+1:]))
      uri_parts = z
  part_count = len(uri_parts)
  try: # may have more parts... so no match
      cache = openapi_spec['cache'][part_count]
  except Exception as e:
    warnings.warn("part_count was:" + part_count)
    warnings.warn("spec['cache'] keys was:" + openapi_spec['cache'])
    raise e
  last_part = None
  last_level = None
  current_level = cache
  for idx in range(part_count):
    part = uri_parts[idx]
    last_level = current_level
    if part in current_level:
      current_level = current_level[part] # part in current_level
    elif idx == part_count-1:
      if part == 'metrics':
        return None
      if part == 'readyz':
        return None
      if part == 'livez':
        return None
      if part == 'healthz':
        return None
      if 'discovery.k8s.io' in uri_parts:
        return None
      #   elif part == '': # The last V
      #     current_level = last_level
      #       else:
      variable_levels=[x for x in current_level.keys() if '{' in x] # vars at current(final) level?
      if len(variable_levels) > 1:
        raise "If we have more than one variable levels... this should never happen."
      next_level=variable_levels[0] # the var is the next level
      current_level = current_level[next_level] # variable part is final part
    else:
      next_part = uri_parts[idx+1]
      variable_levels={next_level:next_part in current_level[next_level].keys() for next_level in [x for x in current_level.keys() if '{' in x]}
      if not variable_levels: # there is no match
        if 'example.com' in part:
          return None
        elif 'kope.io' in part:
          return None
        elif 'snapshot.storage.k8s.io' in part:
          return None
        elif 'discovery.k8s.io' in part:
          return None
        elif 'metrics.k8s.io' in part:
          return None
        elif 'wardle.k8s.io' in part:
          return None
        elif ['openapi','v2'] == uri_parts: # not part our our spec
          return None
        else:
          print(url.path)
          return None
      try: # may have more parts... so no match # variable_levels -> {'{namespace}': False}
        next_level={v: k for k, v in variable_levels.items()}[True]
      except Exception as e: # TODO better to not use try/except
        next_level=[*variable_levels][0]
      # import ipdb; ipdb.set_trace()
      current_level = current_level[next_level] #coo
  try:
    op_id=current_level[method]
  except Exception as err:
    warnings.warn("method was:" + method)
    warnings.warn("current_level keys:" + current_level.keys())
    raise err
  if url.path not in openapi_spec['hit_cache']:
    openapi_spec['hit_cache'][url.path]={method:op_id}
  else:
    openapi_spec['hit_cache'][url.path][method]=op_id
  return op_id

def load_audit_events(bucket,job):
    """
    Grabs all audits logs available for a given bucket/job, combines them into a
    single audit log, then returns the paths for where the raw downloads and
    combined audit logs are stored.
    """
    BUCKETS_PATH = 'https://storage.googleapis.com/kubernetes-jenkins/logs/'
    ARTIFACTS_PATH ='https://gcsweb.k8s.io/gcs/kubernetes-jenkins/logs/'
    K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
    downloads = {}
    bucket_url = BUCKETS_PATH + bucket + '/' + job + '/'
    artifacts_url = ARTIFACTS_PATH + bucket + '/' +  job + '/' + 'artifacts'
    download_path = mkdtemp( dir='/tmp', prefix='apisnoop-' + bucket + '-' + job ) + '/'
    combined_log_file = download_path + 'audit.log'
    swagger, metadata, commit_hash = fetch_swagger(bucket, job)

    # download all metadata
    job_metadata_files = [
        'finished.json',
        'artifacts/metadata.json',
        'artifacts/junit_01.xml',
        'build-log.txt'
    ]
    for jobfile in job_metadata_files:
        download_url_to_path( bucket_url + jobfile,
                              download_path + jobfile, downloads )

    # download all logs
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
        for logfile in sorted(
                glob.glob(download_path + '*kube-apiserver-audit*'), reverse=True):
            if logfile.endswith('z'):
                subprocess.run(['zcat', logfile], stdout=log, check=True)
            else:
                subprocess.run(['cat', logfile], stdout=log, check=True)

    # Process the resulting combined raw audit.log by adding operationId
    swagger_url = K8S_GITHUB_REPO + commit_hash + '/api/openapi-spec/swagger.json'
    spec = load_openapi_spec(swagger_url)
    infilepath=combined_log_file
    outfilepath=combined_log_file+'+opid'
    with open(infilepath) as infile:
        with open(outfilepath,'w') as output:
            for line in infile.readlines():
                event = json.loads(line)
                event['operationId']=find_operation_id(spec,event)
                output.write(json.dumps(event)+'\n')
    return (download_path, outfilepath)

def json_to_sql(bucket,job,download_path):
    """
      Turns json+audits into load.sql
    """
    auditlog_path = download_path + "/audit.log+opid"
    try:
        sql = Template("""
CREATE TEMPORARY TABLE raw_audit_event_import (data jsonb not null) ;
COPY raw_audit_event_import (data)
FROM '${audit_logfile}' (DELIMITER e'\x02', FORMAT 'csv', QUOTE e'\x01');

INSERT INTO raw_audit_event(bucket, job,
                             audit_id, stage,
                             event_verb, request_uri,
                             operation_id,
                             data)
SELECT '${bucket}', '${job}',
       (raw.data ->> 'auditID'), (raw.data ->> 'stage'),
       (raw.data ->> 'verb'), (raw.data ->> 'requestURI'),
       (raw.data ->> 'operationId'),
       raw.data
  FROM raw_audit_event_import raw;
        """).substitute(
            audit_logfile = auditlog_path,
            bucket = bucket,
            job = job
        )
        sqlfile_path = download_path + 'load_audit_events.sql'
        with open(sqlfile_path, 'w') as sqlfile:
            sqlfile.write(sql)
        print("it worked: " + sqlfile_path)
        return sqlfile_path
    # except plpy.SPIError:
    #     return "something went wrong with plpy"
    except:
        return "something unknown went wrong"

def insert_audits_into_db (download_path, auditlog_path):
    # try:
    #     plpy.here?
    # except:
    #     from SQL import sqllib as plpy
    rv = plpy.execute(sql)
