-- Create
-- #+NAME: load_audit_events.sql

set role dba;
CREATE OR REPLACE FUNCTION load_audit_events(
custom_bucket text default null,
custom_job text default null)
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
from snoopUtils import deep_merge, get_html, download_url_to_path, load_openapi_spec, determine_bucket_job, fetch_swagger, get_all_auditlog_links

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
    plpy.warning("method was:" + method)
    plpy.warning("current_level keys:" + current_level.keys())
    raise err
  if url.path not in openapi_spec['hit_cache']:
    openapi_spec['hit_cache'][url.path]={method:op_id}
  else:
    openapi_spec['hit_cache'][url.path][method]=op_id
  return op_id

# this global dict is used to track our wget subprocesses
# wget was used because the files can get to several halfa gig

bucket, job = determine_bucket_job(custom_bucket, custom_job)
BUCKETS_PATH = 'https://storage.googleapis.com/kubernetes-jenkins/logs/'
ARTIFACTS_PATH ='https://gcsweb.k8s.io/gcs/kubernetes-jenkins/logs/'
K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
def load_audit_events(bucket,job):
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
        return "it worked"
    except plpy.SPIError:
        return "something went wrong with plpy"
    except:
        return "something unknown went wrong"
load_audit_events(bucket,job)
$$ LANGUAGE plpython3u ;
reset role;
