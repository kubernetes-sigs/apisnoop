-- 610: Endpoints Hit by New Test
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/610_view_endpoints_hit_by_new_test.up.sql
--     :END:
--    #+NAME: endpoints hit by new test

-- [[file:~/apisnoop/apps/hasura/index.org::endpoints%20hit%20by%20new%20test][endpoints hit by new test]]
CREATE OR REPLACE VIEW "public"."endpoints_hit_by_new_test" AS
  WITH live_testing_endpoints AS (
    SELECT DISTINCT
      operation_id,
      useragent,
      count(*) as hits
      FROM
          audit_event
     GROUP BY operation_id, useragent
  ), baseline AS  (
    SELECT DISTINCT
      operation_id,
      tested,
      conf_tested
      FROM endpoint_coverage
     WHERE bucket != 'apisnoop'
  )
  SELECT DISTINCT
    lte.useragent,
    lte.operation_id,
    b.tested as hit_by_ete,
    lte.hits as hit_by_new_test
    FROM live_testing_endpoints lte
           JOIN baseline b ON (b.operation_id = lte.operation_id);
-- endpoints hit by new test ends here
