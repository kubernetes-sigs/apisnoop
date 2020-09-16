CREATE OR REPLACE VIEW "testing"."untested_stable_endpoint" AS
  with latest_release as (
  select release::semver as release
    from open_api
   order by release::semver desc
   limit 1
  )
  select ec.*,
         exists(select * from conformance.eligible_endpoint ee where ee.endpoint = ec.endpoint) as eligible
    from endpoint_coverage  ec
    join latest_release on(ec.release::semver = latest_release.release)
   where level = 'stable'
     and tested is false
   ORDER BY endpoint desc;
