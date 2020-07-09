CREATE OR REPLACE FUNCTION load_audit_events(
  custom_bucket text default null,
  custom_job text default null)
  RETURNS text AS $$
  from string import Template
  from snoopUtils import determine_bucket_job, download_and_process_auditlogs, fetch_swagger

  bucket, job = determine_bucket_job(custom_bucket, custom_job)
  auditlog_file = download_and_process_auditlogs(bucket, job)
  _, metadata, _ = fetch_swagger(bucket, job)
  release_date = int(metadata['timestamp'])
  release = metadata["version"].split('-')[0].replace('v','')
  num = release.replace('.','')

  sql = Template("""
    CREATE TEMPORARY TABLE audit_event_import${job}(data jsonb not null) ;
    COPY audit_event_import${job}(data)
    FROM '${audit_logfile}' (DELIMITER e'\x02', FORMAT 'csv', QUOTE e'\x01');

    INSERT INTO audit_event(release, release_date,
                            audit_id, endpoint,
                            useragent, test,
                            test_hit, conf_test_hit,
                            data, source)

    SELECT trim(leading 'v' from '${release}') as release,
            '${release_date}',
            (raw.data ->> 'auditID'),
            (raw.data ->> 'operationId') as endpoint,
            (raw.data ->> 'userAgent') as useragent,
            CASE
              WHEN ((raw.data ->> 'userAgent') like 'e2e.test%')
                THEN trim(split_part((raw.data->>'userAgent'), '--'::text, 2))
              ELSE null
            END as test,
            ((raw.data ->> 'userAgent') like 'e2e.test%') as test_hit,
            ((raw.data ->> 'userAgent') like '%[Conformance]%') as conf_test_hit,
            raw.data,
            'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs/${bucket}/${job}' as source
      FROM audit_event_import${job} raw;
            """).substitute(
                audit_logfile = auditlog_file,
                release = release,
                bucket = bucket,
                job = job,
                release_date = release_date
            )
  try:
      plpy.execute(sql)
      return "it worked"
  except plpy.SPIError as plpyError:
      print("something went wrong with plpy: ")
      return plpyError
  except:
      return "something unknown went wrong"
  $$ LANGUAGE plpython3u ;
  reset role;

comment on function load_audit_events is 'loads all audit events from given bucket, job.  if neither given, loads latest successful job from sig-release blocking. if just bucket given, loads latest successful job for that bucket.';
