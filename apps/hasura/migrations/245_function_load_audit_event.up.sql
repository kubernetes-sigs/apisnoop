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
    # Load the resulting combined audit.log directly into raw_audit_event
    try:
        # for some reason tangling isn't working to reference this SQL block
        sql = Template("""
CREATE TEMPORARY TABLE raw_audit_event_import (data jsonb not null) ;
COPY raw_audit_event_import (data)
FROM '${audit_logfile}' (DELIMITER e'\x02', FORMAT 'csv', QUOTE e'\x01');

INSERT INTO raw_audit_event(bucket, job,
                             audit_id, stage,
                             event_verb, request_uri,
                             -- operation_id,
                             data)
SELECT '${bucket}', '${job}',
       (raw.data ->> 'auditID'), (raw.data ->> 'stage'),
       (raw.data ->> 'verb'), (raw.data ->> 'requestURI'),
       -- ops.operation_id,
       raw.data 
  FROM raw_audit_event_import raw;
         -- FIXME: this join is necesary, but expensive
         -- https://github.com/cncf/apisnoopregexp is an alterative approach
         -- LEFT JOIN api_operation_material ops ON
         --  ops.raw_swagger_id = 1
         --    AND raw.data ->> 'verb' = ANY(ops.event_verb)
         --    AND raw.data ->> 'requestURI' ~ ops.regex;
        """).substitute(
            audit_logfile = combined_log_file,
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
if __name__ == "__main__":
    load_audit_events('ci-kubernetes-e2e-gci-gce','1134962072287711234')
else:
    load_audit_events(bucket,job)
$$ LANGUAGE plpython3u ;
reset role;
