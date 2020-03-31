-- 620:Projected Change in Coverage
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/620_view_projected_change_in_coverage.up.sql
--     :END:
--     #+NAME: PROJECTED Change in Coverage

-- [[file:~/apisnoop/apps/hasura/index.org::PROJECTED%20Change%20in%20Coverage][PROJECTED Change in Coverage]]
CREATE OR REPLACE VIEW "public"."projected_change_in_coverage" AS
 WITH baseline AS (
   SELECT *
     FROM
         stable_endpoint_stats
    WHERE job != 'live'
 ), test AS (
   SELECT
     COUNT(1) AS endpoints_hit
     FROM
         (
           SELECT
             operation_id
     FROM audit_event
      WHERE useragent like 'live-test%'
     EXCEPT
     SELECT
       operation_id
     FROM
         endpoint_coverage
         WHERE tested is true
               ) tested_endpoints
 ), coverage AS (
   SELECT
   baseline.test_hits AS old_coverage,
   (baseline.test_hits::int + test.endpoints_hit::int) AS new_coverage
   FROM baseline, test
 )
 SELECT
   'test_coverage' AS category,
   baseline.total_endpoints,
   coverage.old_coverage,
   coverage.new_coverage,
   (coverage.new_coverage - coverage.old_coverage) AS change_in_number
   FROM baseline, coverage
          ;
-- PROJECTED Change in Coverage ends here



-- #+RESULTS: PROJECTED Change in Coverage

-- [[file:~/apisnoop/apps/hasura/index.org::*620:Projected%20Change%20in%20Coverage][620:Projected Change in Coverage:2]]
CREATE VIEW
-- 620:Projected Change in Coverage:2 ends here
