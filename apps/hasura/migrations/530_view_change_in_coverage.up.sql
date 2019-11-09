-- 530: Change in Coverage 
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/530_view_change_in_coverage.up.sql
--    :END:
--    #+NAME: Change in Coverage

CREATE OR REPLACE VIEW "public"."change_in_coverage" AS
  with last_two_runs as (
    select
      *
      FROM
          stable_endpoint_stats
     ORDER BY 
       date DESC
     LIMIT 2
  ), new_coverage as (
    SELECT *
      FROM last_two_runs
     order by date desc
     limit 1
  ), old_coverage as (
    SELECT *
      FROM last_two_runs
     order by date asc
     limit 1
  )
      (
        select
          'test hits' as category,
          old_coverage.test_hits as old_coverage,
          new_coverage.test_hits as new_coverage,
          (new_coverage.test_hits - old_coverage.test_hits) as change_in_number,
          (new_coverage.percent_tested - old_coverage.percent_tested) as change_in_percent
          from old_coverage
               , new_coverage
      )
      UNION
      (
        select
          'conf hits' as category,
          old_coverage.conf_hits as old_coverage,
          new_coverage.conf_hits as new_coverage,
          (new_coverage.conf_hits - old_coverage.conf_hits) as change_in_number,
          (new_coverage.percent_conf_tested - old_coverage.percent_conf_tested) as change_in_percent
          from 
              old_coverage
            , new_coverage
      )
      ;
