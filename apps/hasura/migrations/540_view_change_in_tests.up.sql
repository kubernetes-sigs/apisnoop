-- 540: Change in Tests 
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/540_view_change_in_tests.up.sql
--    :END:
--    #+NAME: Change in Tests

CREATE OR REPLACE VIEW "public"."change_in_tests" AS
  with last_two_runs as (
    select
      job, job_timestamp
      FROM
          bucket_job_swagger
     ORDER BY 
       job_timestamp DESC
     LIMIT 2
  ),
    new_run as (
      SELECT 
        job
        FROM last_two_runs
       order by job_timestamp DESC
       limit 1
    ),
    old_run as (
      SELECT
        job
        FROM
            last_two_runs
       order by job_timestamp asc
       limit 1
    )
      (
        SELECT
          test,
          'added' as status
          FROM
              (
                (
                  SELECT DISTINCT
                    split_part(useragent, '--', 2) as test
                    FROM
                        audit_event
                        INNER JOIN new_run on (audit_event.job = new_run.job)
                )
                EXCEPT
                (
                  SELECT DISTINCT
                    split_part(useragent, '--', 2) as test
                    FROM
                        audit_event
                        INNER JOIN old_run on (audit_event.job = old_run.job)
                )
              ) added_tests
      )
      UNION
      (
        SELECT
          test,
          'removed' as status
          FROM
              (
                (
                  SELECT DISTINCT
                    split_part(useragent, '--', 2) as test
                    FROM
                        audit_event
                        INNER JOIN old_run on (audit_event.job = old_run.job)
                )
                EXCEPT
                (
                  SELECT DISTINCT
                    split_part(useragent, '--', 2) as test
                    FROM
                        audit_event
                        INNER JOIN new_run on (audit_event.job = new_run.job)
                )
              ) removed_tests
      )
      ;
