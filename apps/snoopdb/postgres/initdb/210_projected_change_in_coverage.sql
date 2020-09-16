CREATE OR REPLACE VIEW "testing"."projected_change_in_coverage" AS
 with latest_release as (
 select release
   from open_api
   order by release::semver desc
   limit 1
), baseline AS (
   SELECT count(*) as total_endpoints,
          count(*) filter(where tested is true) as tested_endpoints
     FROM
         endpoint_coverage
         join latest_release using(release)
 ), test AS (
   SELECT
     COUNT(1) AS endpoints_hit
     FROM
         (
           SELECT
             endpoint
     FROM testing.audit_event

      WHERE useragent like 'live%'
     EXCEPT
     SELECT
      endpoint
     FROM
         endpoint_coverage
         WHERE tested is true
               ) tested_endpoints
 ), coverage AS (
   SELECT
   baseline.tested_endpoints as old_coverage,
   (baseline.tested_endpoints::int + test.endpoints_hit::int) AS new_coverage
   FROM baseline, test
 )
 SELECT
   'test_coverage' AS category,
   baseline.total_endpoints,
   coverage.old_coverage,
   coverage.new_coverage,
   (coverage.new_coverage - coverage.old_coverage) AS change_in_number
   FROM baseline, coverage ;
