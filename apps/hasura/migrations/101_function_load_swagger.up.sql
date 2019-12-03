-- 101: Function to Load Swagger 
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/101_function_load_swagger.up.sql
--   :END:
  
--    #+NAME: load_swagger.sql

set role dba;
DROP FUNCTION IF EXISTS load_swagger;
CREATE OR REPLACE FUNCTION load_swagger(
  custom_bucket text default null,
  custom_job text default null,
  live boolean default false)
RETURNS text AS $$
try:
    from urllib.request import urlopen, urlretrieve
    from string import Template
    import os
    import json

    def get_json(url):
        body = urlopen(url).read()
        data = json.loads(body)
        return data

    gcs_logs="https://storage.googleapis.com/kubernetes-jenkins/logs/"
    #establish bucket we'll draw test results from.
    baseline_bucket = os.environ['APISNOOP_BASELINE_BUCKET'] if 'APISNOOP_BASELINE_BUCKET' in os.environ.keys() else 'ci-kubernetes-e2e-gci-gce'
    bucket =  baseline_bucket if custom_bucket is None else custom_bucket

    #grab the latest successful test run for our chosen bucket.
    testgrid_history = get_json(gcs_logs + bucket + "/jobResultsCache.json")
    latest_success = [x for x in testgrid_history if x['result'] == 'SUCCESS'][-1]['buildnumber']

    #establish job 
    baseline_job = os.environ['APISNOOP_BASELINE_JOB'] if 'APISNOOP_BASELINE_JOB' in os.environ.keys() else latest_success
    job = baseline_job if custom_job is None else custom_job

    metadata_url = ''.join(['https://storage.googleapis.com/kubernetes-jenkins/logs/', bucket, '/', job, '/finished.json'])
    metadata = json.loads(urlopen(metadata_url).read().decode('utf-8'))
    commit_hash = metadata["version"].split("+")[1]
    swagger_url =  ''.join(['https://raw.githubusercontent.com/kubernetes/kubernetes/', commit_hash, '/api/openapi-spec/swagger.json']) 
    swagger = json.loads(urlopen(swagger_url).read().decode('utf-8')) # may change this to ascii
    sql = """
 INSERT INTO bucket_job_swagger(
           bucket,
           job,
           commit_hash, 
           passed,
           job_result,
           pod,
           infra_commit,
           job_version,
           job_timestamp,
           node_os_image,
           master_os_image,
           swagger
    )
   SELECT
           $1 as bucket,
           $2 as job,
           $3 as commit_hash,
           $4 as passed,
           $5 as job_result,
           $6 as pod,
           $7 as infra_commit,
           $8 as job_version,
           (to_timestamp($9)) AT TIME ZONE 'UTC' as job_timestamp,
           $10 as node_os_image,
           $11 as master_os_image,
           $12 as swagger
    """
    plan = plpy.prepare(sql, [
        'text','text','text','text',
        'text','text','text','text',
        'integer','text','text','jsonb'])
    rv = plpy.execute(plan, [
        bucket if not live else 'apisnoop',
        job if not live else 'live',
        commit_hash,
        metadata['passed'],
        metadata['result'],
        metadata['metadata']['pod'],
        metadata['metadata']['infra-commit'],
        metadata['version'],
        int(metadata['timestamp']),
        metadata['metadata']['node_os_image'],
        metadata['metadata']['master_os_image'],
        json.dumps(swagger)
    ])
    return ''.join(["Success!  Added the swagger for job ", job, " from bucket ", bucket])
except Exception as err:
    return Template("something went wrong, likely this: ${error}").substitute(error = err)
$$ LANGUAGE plpython3u ;
reset role;
