-- Create
-- #+NAME: load_audit_events.sql

set role dba;
CREATE OR REPLACE FUNCTION load_audit_events(bucket text, job text)
RETURNS text AS $$
#!/usr/bin/env python3
from urllib.request import urlopen, urlretrieve
import os
import re
from bs4 import BeautifulSoup
import subprocess
import time
import glob
from tempfile import mkdtemp
from string import Template
from urllib.parse import urlparse
import requests
import hashlib
from collections import defaultdict
import json
import csv
import sys

from copy import deepcopy
from functools import reduce

def deep_merge(*dicts, update=False):
    """
    Merges dicts deeply.
    Parameters
    ----------
    dicts : list[dict]
        List of dicts.
    update : bool
        Whether to update the first dict or create a new dict.
    Returns
    -------
    merged : dict
        Merged dict.
    """
    def merge_into(d1, d2):
        for key in d2:
            if key not in d1 or not isinstance(d1[key], dict):
                d1[key] = deepcopy(d2[key])
            else:
                d1[key] = merge_into(d1[key], d2[key])
        return d1

    if update:
        return reduce(merge_into, dicts[1:], dicts[0])
    else:
        return reduce(merge_into, dicts, {})
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
      uri_parts = uri_parts[0:uri_parts.index('proxy')]
  part_count = len(uri_parts)
  try: # may have more parts... so no match
      cache = openapi_spec['cache'][part_count]
  except Exception as e:
    plpy.warning("part_count was:" + part_count)
    plpy.warning("spec['cache'] keys was:" + openapi_spec['cache'])
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
        elif 'metrics.k8s.io' in part:
          return None
        elif 'wardle.k8s.io' in part:
          return None
        elif ['openapi','v2'] == uri_parts: # not part our our spec
          return None
        else:
          print(url.path)
          return None
      next_level={v: k for k, v in variable_levels.items()}[True]
      current_level = current_level[next_level] #coo
  try:
    op_id=current_level[method]
  except Exception as err:
    plpy.warning("method was:" + method)
    plpy.warning("current_level keys:" + current_level.keys())
    raise err
  if url.path not in openapi_spec['hit_cache']:
    openapi_spec['hit_cache'][url.path]={method:op_id}
  else:
    openapi_spec['hit_cache'][url.path][method]=op_id
  return op_id

def get_html(url):
    html = urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    return soup


def download_url_to_path(url, local_path):
    local_dir = os.path.dirname(local_path)
    if not os.path.isdir(local_dir):
        os.makedirs(local_dir)
    if not os.path.isfile(local_path):
        process = subprocess.Popen(['wget', '-q', url, '-O', local_path])
        downloads[local_path] = process

# this global dict is used to track our wget subprocesses
# wget was used because the files can get to several halfa gig
downloads = {}
def load_audit_events(bucket,job):
    bucket_url = 'https://storage.googleapis.com/kubernetes-jenkins/logs/' + bucket + '/' + job + '/'
    artifacts_url = 'https://gcsweb.k8s.io/gcs/kubernetes-jenkins/logs/' + bucket + '/' +  job + '/' + 'artifacts'
    job_metadata_files = [
        'finished.json',
        'artifacts/metadata.json',
        'artifacts/junit_01.xml',
        'build-log.txt'
    ]
    download_path = mkdtemp( dir='/tmp', prefix='apisnoop-' + bucket + '-' + job ) + '/'
    combined_log_file = download_path + 'audit.log'

    # meta data to download
    for jobfile in job_metadata_files:
        download_url_to_path( bucket_url + jobfile,
                              download_path + jobfile )

    # Use soup to grab url of each of audit.log.* (some end in .gz)
    soup = get_html(artifacts_url)
    master_link = soup.find(href=re.compile("master"))
    master_soup = get_html(
        "https://gcsweb.k8s.io" + master_link['href'])
    log_links = master_soup.find_all(
        href=re.compile("audit.log"))

    finished_metadata = json.load(open(download_path + 'finished.json'))
    commit_hash=finished_metadata['job-version'].split('+')[1]
    # download all logs
    for link in log_links:
        log_url = link['href']
        log_file = download_path + os.path.basename(log_url)
        download_url_to_path( log_url, log_file)

    # Our Downloader uses subprocess of curl for speed
    for download in downloads.keys():
        # Sleep for 5 seconds and check for next download
        while downloads[download].poll() is None:
            time.sleep(5)
            # print("Still downloading: " + download)
        # print("Downloaded: " + download)

    # Loop through the files, (z)cat them into a combined audit.log
    with open(combined_log_file, 'ab') as log:
        for logfile in sorted(
                glob.glob(download_path + '*kube-apiserver-audit*'), reverse=True):
            if logfile.endswith('z'):
                subprocess.run(['zcat', logfile], stdout=log, check=True)
            else:
                subprocess.run(['cat', logfile], stdout=log, check=True)
    # Process the resulting combined raw audit.log by adding operationId
    spec = load_openapi_spec('https://raw.githubusercontent.com/kubernetes/kubernetes/' + commit_hash +  '/api/openapi-spec/swagger.json')
    infilepath=combined_log_file
    outfilepath=combined_log_file+'+opid'
    with open(infilepath) as infile:
        with open(outfilepath,'w') as output:
            for line in infile.readlines():
                event = json.loads(line)
                event['operationId']=find_operation_id(spec,event)
                output.write(json.dumps(event)+'\n')
    #####
    # Load the resulting updated audit.log directly into raw_audit_event
    try:
        # for some reason tangling isn't working to reference this SQL block
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
            audit_logfile = outfilepath,
            # audit_logfile = combined_log_file,
            bucket = bucket,
            job = job
        )
        with open(download_path + 'load.sql', 'w') as sqlfile:
          sqlfile.write(sql)
        rv = plpy.execute(sql)
        #plpy.commit()
        # this calls external binary, not part of transaction 8(
        #rv = plpy.execute("select * from audit_event_op_update();")
        #plpy.commit()
        #rv = plpy.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY podspec_field_coverage_material;")
        #plpy.commit()
        return "it worked"
    except plpy.SPIError:
        return "something went wrong with plpy"
    except:
        return "something unknown went wrong"
#if __name__ == "__main__":
#    load_audit_events('ci-kubernetes-e2e-gci-gce','1134962072287711234')
#else:
load_audit_events(bucket,job)
$$ LANGUAGE plpython3u ;
reset role;
