-- 101: Function to Load Swagger
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/101_function_load_swagger.up.sql
--     :END:
--      #+NAME: load_swagger.sql

-- [[file:~/apisnoop/apps/hasura/index.org::load_swagger.sql][load_swagger.sql]]
set role dba;
DROP FUNCTION IF EXISTS load_swagger;
CREATE OR REPLACE FUNCTION load_swagger(
  custom_bucket text default null,
  custom_job text default null,
  live boolean default false)
RETURNS text AS $$
#Import our snoop utilities and values
import json
from snoopUtils import determine_bucket_job, fetch_swagger

bucket, job = determine_bucket_job(custom_bucket, custom_job)
swagger, metadata, commit_hash = fetch_swagger(bucket, job)

## define our sql statement
sql = """
INSERT INTO bucket_job_swagger(
        bucket,
        job,
        commit_hash,
        passed,
        job_result,
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
        $6 as infra_commit,
        $7 as job_version,
        (to_timestamp($8)) AT TIME ZONE 'UTC' as job_timestamp,
        $9 as node_os_image,
        $10 as master_os_image,
        $11 as swagger
"""

## Submit sql statement with values substituted in
plan = plpy.prepare(sql, [
    'text','text','text','text',
    'text','text','text',
    'integer','text','text','jsonb'])
try:
  rv = plpy.execute(plan, [
      bucket if not live else 'apisnoop',
      job if not live else 'live',
      commit_hash,
      metadata['passed'],
      metadata['result'],
      metadata['metadata']['infra-commit'],
      metadata['version'],
      int(metadata['timestamp']),
      metadata['metadata']['node_os_image'],
      metadata['metadata']['master_os_image'],
      json.dumps(swagger)
  ])
  ## Celebrate
  return ''.join(["Success!  Added the swagger for job ", job, " from bucket ", bucket])
except:
  e = sys.exc_info()[0]
  print("<p>Error: %s</p>" % e )
$$ LANGUAGE plpython3u ;
reset role;
-- load_swagger.sql ends here
