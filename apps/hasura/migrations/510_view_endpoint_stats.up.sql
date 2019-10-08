-- 510: endpoint_stats_view
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/510_view_endpoint_stats.up.sql
--    :END:
--    Based on the update we give to dan, developed in [[file:explorations/ticket_50_endpoint_coverage.org][ticket 50: endpoint coverage]] 
--    #+NAME: Endpoint Stats View

CREATE OR REPLACE VIEW "public"."endpoint_stats" AS
SELECT
  date,
  COUNT(1) as total_endpoints,
  COUNT(1) filter(WHERE test_hits > 0) as test_hits,
  COUNT(1) filter(WHERE conf_hits > 0) as conf_hits,
  ROUND(((count(*) filter(WHERE test_hits > 0)) * 100 )::numeric / count(*), 2) as percent_tested,
  ROUND(((count(*) filter(WHERE conf_hits > 0)) * 100 )::numeric / count(*), 2) as percent_conf_tested
  FROM endpoint_coverage 
 GROUP BY date;
