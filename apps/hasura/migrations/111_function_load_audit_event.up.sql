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
from snoopUtils import deep_merge, get_html, download_url_to_path, load_openapi_spec, determine_bucket_job, fetch_swagger, get_all_auditlog_links, find_operation_id

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
