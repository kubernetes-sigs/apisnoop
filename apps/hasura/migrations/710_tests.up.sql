-- Create
-- #+NAME: tests view

CREATE OR REPLACE VIEW "public"."tests" AS 
  WITH raw_tests AS (
    SELECT audit_event.operation_id,
           audit_event.bucket,
           audit_event.job,
           array_to_string(regexp_matches(audit_event.useragent, '\[[a-zA-Z0-9\.\-:]*\]'::text, 'g'::text), ','::text) AS test_tag,
           split_part(audit_event.useragent, '--'::text, 2) AS test
      FROM audit_event
     WHERE ((audit_event.useragent ~~ 'e2e.test%'::text) AND (audit_event.job <> 'live'::text))
  )
  SELECT DISTINCT raw_tests.bucket,
                  raw_tests.job,
                  raw_tests.test,
                  array_agg(DISTINCT raw_tests.operation_id) AS operation_ids,
                  array_agg(DISTINCT raw_tests.test_tag) AS test_tags
    FROM raw_tests
   GROUP BY raw_tests.test, raw_tests.bucket, raw_tests.job;
