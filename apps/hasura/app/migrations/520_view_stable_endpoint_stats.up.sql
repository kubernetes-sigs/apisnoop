-- 520: stable endpoint_stats_view
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/520_view_stable_endpoint_stats.up.sql
--     :END:
--     Based on the update we give to dan, developed in [[file:explorations/ticket_50_endpoint_coverage.org][ticket 50: endpoint coverage]]
    
--     #+NAME: Endpoint Stats View

-- [[file:~/apisnoop/apps/hasura/index.org::Endpoint%20Stats%20View][Endpoint Stats View]]
CREATE OR REPLACE VIEW "public"."stable_endpoint_stats" AS
SELECT
  ec.bucket,
  ec.job,
  trim(trailing '-' from substring(bjs.job_version from 2 for 7)) as release, -- from v1.19.0-alphaxxx to 1.19.0
  ec.date,
  COUNT(1) as total_endpoints,
  COUNT(1) filter(WHERE tested is true) as test_hits,
  COUNT(1) filter(WHERE conf_tested is true) as conf_hits,
  ROUND(((count(*) filter(WHERE tested is true)) * 100 )::numeric / count(*), 2) as percent_tested,
  ROUND(((count(*) filter(WHERE conf_tested is true)) * 100 )::numeric / count(*), 2) as percent_conf_tested
  FROM endpoint_coverage ec
         JOIN bucket_job_swagger bjs on (bjs.bucket = ec.bucket AND bjs.job = ec.job)
    WHERE ec.level = 'stable'
 GROUP BY ec.date, ec.job, ec.bucket, bjs.job_version;
-- Endpoint Stats View ends here
