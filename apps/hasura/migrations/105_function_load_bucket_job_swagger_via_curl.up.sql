-- 101: Function to Load bucket_job_swagger via curl
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/105_function_load_bucket_job_swagger_via_curl.up.sql
--   :END:
  
--    #+NAME: load_bucket_job_swagger_via_curl.sql

set role dba;
DROP FUNCTION IF EXISTS load_bucket_job_swagger_via_curl;
CREATE OR REPLACE FUNCTION load_bucket_job_swagger_via_curl(
  bucket text default null,
  job text default null,
  live boolean default false)
RETURNS text AS $$
try:
    from urllib.request import urlopen, urlretrieve
    from string import Template
    import json
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
    if live:
        rv = plpy.execute(plan, [
            'apisnoop',
            'live',
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
    else:
        rv = plpy.execute(plan, [
            bucket,
            job,
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
    return "it worked!"
except Exception as err:
    return Template("something went wrong, likely this: ${error}").substitute(error = err)
$$ LANGUAGE plpython3u ;
reset role;
