create or replace function load_audit_events(
  custom_bucket text default null,
  custom_job text default null)

  returns text AS $$
  from string import Template
  from urllib.request import urlopen
  import json
  import yaml
  import os
  from snoopUtils import determine_bucket_job, download_and_process_auditlogs

  GCS_LOGS="https://storage.googleapis.com/kubernetes-jenkins/logs/"
  RELEASES_URL = "https://raw.githubusercontent.com/cncf/apisnoop/master/resources/coverage/releases.yaml"

  if "TESTING_ONLY" in os.environ:
    return "TESTING_ONLY is set, no audit events loaded."

  releases = yaml.safe_load(urlopen(RELEASES_URL))
  latest_release = releases[0]['version']

  bucket, job = determine_bucket_job(custom_bucket, custom_job)
  plpy.log("our bucket and job", detail=[bucket,job])
  metadata_url = ''.join([GCS_LOGS, bucket, '/', job, '/finished.json'])
  metadata = json.loads(urlopen(metadata_url).read().decode('utf-8'))
  plpy.log("our finished json", detail=urlopen(metadata_url).read().decode('utf-8'))
  auditlog_file = download_and_process_auditlogs(bucket, job)

  release_date = int(metadata['timestamp'])
  if bucket == 'ci-audit-kind-conformance':
      release = latest_release
  else:
      release = metadata["version"].split('-')[0].replace('v','')
      num = release.replace('.','')
      if int(release.split('.')[1]) > int(latest_release.split('.')[1]):
          release = latest_release
  # if we are grabbing latest release, and it is on the cusp of  anew release,
  # then test runs will show their version as the next release...which is confusing,
  # this period is a code freeze, where tests can still be added, and so the logs we are
  # seeing still shows coverage for the version just about to be released.
  # when this happens, we set our release to what is canonically the latest.
  if custom_bucket is None and custom_job is None:
    release = latest_release

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
      return "events for {} loaded, from {}/{}".format(release, bucket, job)
  except plpy.SPIError as plpyError:
      print("something went wrong with plpy: ")
      return plpyError
  except:
      return "something unknown went wrong"
  $$ LANGUAGE plpython3u ;
  reset role;

comment on function load_audit_events is 'loads all audit events from given bucket, job.  if neither given, loads latest successful job from sig-release blocking. if just bucket given, loads latest successful job for that bucket.';

select 'load_audit_events function defined and commented' as "build log";
