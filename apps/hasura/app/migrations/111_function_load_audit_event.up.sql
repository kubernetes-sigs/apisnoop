set role dba;
CREATE OR REPLACE FUNCTION load_audit_events(
  custom_bucket text default null,
  custom_job text default null)
  RETURNS text AS $$
  from snoopUtils import determine_bucket_job, download_and_process_auditlogs, json_to_sql
  bucket, job = determine_bucket_job(custom_bucket, custom_job)
  auditlog_path = download_and_process_auditlogs(bucket, job)
  sql_string = json_to_sql(bucket,job,auditlog_path) 
  try:
      plpy.execute(sql_string)
      return "it worked"
  except plpy.SPIError as plpyError:
      print("something went wrong with plpy: ") 
      return plpyError
  except:
      return "something unknown went wrong"
  $$ LANGUAGE plpython3u ;
  reset role;
