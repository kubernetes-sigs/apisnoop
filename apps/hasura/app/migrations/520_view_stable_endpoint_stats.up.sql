CREATE OR REPLACE VIEW "public"."stable_endpoint_stats" AS
  WITH ineligible_endpoints as (
    SELECT DISTINCT
      operation_id
      FROM endpoint_coverage 
     where path LIKE '%volume%'
        OR kind LIKE 'ComponentStatus'
        OR (kind LIKE 'Node' AND k8s_action = ANY('{"delete","post"}'))
    ), stats as (
SELECT
  ec.bucket,
  ec.job,
  trim(trailing '-' from substring(bjs.job_version from 2 for 7)) as release, -- from v1.19.0-alphaxxx to 1.19.0
  ec.date,
  COUNT(1) as total_endpoints,
  COUNT(1) filter(WHERE operation_id NOT IN(SELECT * from ineligible_endpoints)) as total_eligible_endpoints,
  COUNT(1) filter(WHERE tested is true) as test_hits,
  COUNT(1) filter(WHERE conf_tested is true) as conf_hits,
  ROUND(((count(*) filter(WHERE tested is true)) * 100 )::numeric / count(*), 2) as percent_tested,
  ROUND(((count(*) filter(WHERE conf_tested is true)) * 100 )::numeric / count(*), 2) as percent_conf_tested,
  ROUND(((count(*) filter(WHERE conf_tested is true)) * 100 )::numeric
        / (count(*) filter(WHERE operation_id NOT IN (select * from ineligible_endpoints)))
        , 2)
    as percent_eligible_conf_tested
  FROM endpoint_coverage ec
         JOIN bucket_job_swagger bjs on (bjs.bucket = ec.bucket AND bjs.job = ec.job)
    WHERE ec.level = 'stable'
 GROUP BY ec.date, ec.job, ec.bucket, bjs.job_version
  )
  SELECT
    *,
    test_hits - lag(test_hits) over (order by date) as test_hits_increase,
    conf_hits - lag(conf_hits) over (order by date) as conf_hits_increase,
    percent_tested - lag(percent_tested) over (order by date) as percent_tested_increase,
    percent_conf_tested - lag(percent_conf_tested) over (order by date) as percent_conf_tested_increase,
    percent_eligible_conf_tested - lag(percent_eligible_conf_tested) over (order by date) as percent_eligible_conf_tested_increase
    FROM
        stats
        ;
