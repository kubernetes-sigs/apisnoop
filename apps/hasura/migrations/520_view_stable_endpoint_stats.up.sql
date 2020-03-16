CREATE OR REPLACE VIEW "public"."stable_endpoint_stats" AS
SELECT
  ec.job,
  ec.date,
  COUNT(1) as total_endpoints,
  COUNT(1) filter(WHERE tested is true) as test_hits,
  COUNT(1) filter(WHERE conf_tested is true) as conf_hits,
  ROUND(((count(*) filter(WHERE tested is true)) * 100 )::numeric / count(*), 2) as percent_tested,
  ROUND(((count(*) filter(WHERE conf_tested is true)) * 100 )::numeric / count(*), 2) as percent_conf_tested
  FROM endpoint_coverage ec
    WHERE ec.level = 'stable'
 GROUP BY ec.date, ec.job;
