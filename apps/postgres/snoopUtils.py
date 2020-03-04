import os
import json
from urllib.request import urlopen, urlretrieve

def get_json(url):
    body = urlopen(url).read()
    data = json.loads(body)
    return data

def determine_bucket_job(custom_bucket=None, custom_job=None):
    GCS_LOGS="https://storage.googleapis.com/kubernetes-jenkins/logs/"
    #establish bucket we'll draw test results from.
    baseline_bucket = os.environ['APISNOOP_BASELINE_BUCKET'] if 'APISNOOP_BASELINE_BUCKET' in os.environ.keys() else 'ci-kubernetes-e2e-gci-gce'
    bucket =  baseline_bucket if custom_bucket is None else custom_bucket

    #grab the latest successful test run for our chosen bucket.
    testgrid_history = get_json(GCS_LOGS + bucket + "/jobResultsCache.json")
    latest_success = [x for x in testgrid_history if x['result'] == 'SUCCESS'][-1]['buildnumber']

    #establish job
    baseline_job = os.environ['APISNOOP_BASELINE_JOB'] if 'APISNOOP_BASELINE_JOB' in os.environ.keys() else latest_success
    job = baseline_job if custom_job is None else custom_job

    return job
