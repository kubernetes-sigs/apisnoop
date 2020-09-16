create or replace view "testing"."endpoint_hit_by_new_test" AS
  with live_testing_endpoints AS (
    SELECT endpoint, useragent,
           count(*) as hits
      from testing.audit_event
      where useragent like 'live%'
     group by endpoint, useragent
  ), baseline as  (
    select distinct
      ec.endpoint,
      ec.tested,
      ec.conf_tested,
      release
      from endpoint_coverage ec
      where ec.release = (
      select release
      from open_api
      order by release::semver desc
      limit 1
     )
  )
  select distinct
    lte.useragent,
    lte.endpoint,
    b.tested as hit_by_ete,
    lte.hits as hit_by_new_test
    from live_testing_endpoints lte
    join baseline b using(endpoint);
