      create or replace function load_audit_events(
        bucket text,
        custom_job text default null)

        returns text AS $$
        from string import Template
        from urllib.request import urlopen
        import json
        import yaml
        import semver
        from snoopUtils import download_and_process_auditlogs, get_meta

        RELEASES_URL = "https://raw.githubusercontent.com/cncf/apisnoop/master/resources/coverage/releases.yaml"

        releases = yaml.safe_load(urlopen(RELEASES_URL))
        latest_release = releases[0]['version']

        meta = get_meta(bucket,custom_job)
        plpy.log("our bucket and job", detail=[bucket,meta.job])

        auditlog_file = download_and_process_auditlogs(bucket, job)

        release_date = int(meta.timestamp)

        # if we are grabbing latest release, and it is on cusp of new release,
        # then test runs will show their version as the next release...which is confusing,
        # this period is a code freeze, where tests can still be added, and so the logs we are
        # seeing still shows coverage for the version just about to be released.
        # when this happens, we set our release to what is canonically the latest.
        release = meta.version if semver.compare(meta.version,latest_release) < 1 else latest_release

        sql = Template("""
          CREATE TEMPORARY TABLE audit_event_import${job}(data jsonb not null) ;
          COPY audit_event_import${job}(data)
          FROM '${audit_logfile}' (DELIMITER e'\x02', FORMAT 'csv', QUOTE e'\x01');

          INSERT INTO audit_event(release, release_date,
                                  audit_id, endpoint,
                                  error,
                                  useragent, test,
                                  test_hit, conf_test_hit,
                                  data, source)

          SELECT  '${release}' as release,
                  '${release_date}',
                  (raw.data ->> 'auditID'),
                  (raw.data ->> 'operationId') as endpoint,
                  (raw.data ->> 'snoopError') as error,
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
