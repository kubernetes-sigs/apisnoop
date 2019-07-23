#!/usr/bin/env python3
import yaml
import json
try:
    from urllib.request import urlopen, urlretrieve
except Exception as e:
    from urllib import urlopen, urlretrieve
#import datetime
import os
import re
from bs4 import BeautifulSoup
import subprocess
import click
import time
import glob

k8s = "https://k8s-testgrid.appspot.com/"
gubernator = "https://gubernator.k8s.io/build/kubernetes-jenkins/logs/"
gcsweb = "https://gcsweb.k8s.io/gcs/kubernetes-jenkins/logs/"
storage = "https://storage.googleapis.com/kubernetes-jenkins/logs/"


# def print_urls(top, sublevel, bucket, job):
#     print(gubernator + bucket + '/' + str(job))
#     print(gcsweb + bucket + '/' + str(job))
#     print(storage + bucket + '/' + str(job))


# def url_to_json(url):
#     with urlopen(url) as response:
#         resp = response.read()
#         data = resp.encode('ascii')
#         return json.loads(data)


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


job_files = [
    'finished.json',
    'artifacts/metadata.json',
    'artifacts/junit_01.xml',
    'build-log.txt'
]

bucket_files=[
    'jobResultsCache.json',
    'latest-build.txt'
]

# we spawn wget to use other threads
# and download in parallel
downloads = {}
@click.command()
@click.argument('sources_yaml',default='audit-sources.yaml')
@click.argument('dest',default='artifacts')
def main(sources_yaml,dest):
    # https://github.com/yaml/pyyaml/wiki/PyYAML-yaml.load(input)-Deprecation
    # s = yaml.load(open(sources).read(),Loader=yaml.FullLoader)
    # s = yaml.load(open(sources).read())
    syaml = yaml.load(open(sources_yaml).read())
    for bucket, info in syaml['buckets'].items():
        bucket_path = dest + '/' + bucket
        if not os.path.isdir(bucket_path):
            os.makedirs(bucket_path)
        print("\nbucket: " + bucket)
        print(gubernator + bucket)
        bucket_local_path = dest + '/' + bucket + '/'
        bucket_url = storage + bucket + '/'
        for filename in bucket_files:
            url = bucket_url + filename
            full_path = bucket_local_path + filename
            download_url_to_path(url, full_path)
            for job in info['jobs']:
                download_path = bucket + '/' + str(job) + '/'
                for filename in job_files:
                    file_path = download_path + filename
                    full_path = dest + '/' + file_path
                    url = storage + file_path
                    download_url_to_path(url, full_path)
                    # import ipdb; ipdb.set_trace(context=60)
                artifacts_url = gcsweb + download_path + 'artifacts'
                soup = get_html(artifacts_url)
                master_link = soup.find(href=re.compile("master"))
                master_soup = get_html(
                    "https://gcsweb.k8s.io" + master_link['href'])
                log_links = master_soup.find_all(
                    href=re.compile("audit.log"))
                for link in log_links:
                    log_path = dest + '/' + download_path + \
                        os.path.basename(link['href'])
                    download_url_to_path(link['href'], log_path)
                print(artifacts_url)

    for download in downloads.keys():
        # import ipdb; ipdb.set_trace(context=60)
        while downloads[download].poll() is None:
            time.sleep(5)
            print("Still downloading: " + download)
        print("Downloaded: " + download)
        # import ipdb; ipdb.set_trace(context=60)
    for logfile in sorted(glob.glob(dest + '/*/*/*audit*'), reverse=True):
        jobdir = os.path.dirname(logfile)
        combined_log_file = jobdir+'/combined-audit.log'
        if logfile == combined_log_file:
            # print("Skipping: " + logfile)
            continue
        log = open(combined_log_file, 'wb')
        print("Processing: " + logfile)
        if logfile.endswith('z'):
            subprocess.call(['zcat', logfile], stdout=log)
        else:
            subprocess.call(['cat', logfile], stdout=log)
        # subprocess.call(['touch', gzfile + '.processed'], stdout=log)


if __name__ == "__main__":
    main()
