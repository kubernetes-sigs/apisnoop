# Our Imports
#    #+NAME: snoopUtil Imports

import os
import json
from urllib.request import urlopen, urlretrieve

# Our Constants
#    #+NAME: snoopUtil Constants

GCS_LOGS="https://storage.googleapis.com/kubernetes-jenkins/logs/"
DEFAULT_BUCKET="ci-kubernetes-gci-gce"
K8S_GITHUB_RAW= "https://raw.githubusercontent.com/kubernetes/kubernetes/"

# Define get_json
#    #+NAME: get_json

def get_json(url):
    """Given a json url path, return json as dict"""
    body = urlopen(url).read()
    data = json.loads(body)
    return data

# Define determine_bucket_job
   

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

# Define fetch_swagger
#    :PROPERTIES:
#    :header-args:python: :tangle no 
#    :END:
#    This function is designed so, given jus ta bucket and a job, we can fetch a swagger.json file from github at the job's exact commit, and prepare it as a dict perfect for passing along to our load_swagger function.
   
#    #+NAME: define fetch_swagger

def fetch_swagger(bucket, job):
    """fetches swagger for given bucket and job and returns it, and its appropariate metadata, in a dict"""
    metadata_url = ''.join([GCS_LOGS, bucket, '/', job, '/finished.json'])
    metadata = json.loads(urlopen(metadata_url).read().decode('utf-8'))
    commit_hash = metadata["version"].split("+")[1]
    swagger_url =  ''.join([K8S_GITHUB_RAW, commit_hash, '/api/openapi-spec/swagger.json'])
    swagger = json.loads(urlopen(swagger_url).read().decode('utf-8')) # may change this to ascii
    return (swagger, metadata, commit_hash);
