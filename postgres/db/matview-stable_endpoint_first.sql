create materialized view stable_endpoint_first as
select distinct
  oa.endpoint,
  (array_agg(test.release order by test.release::semver))[1] as first_conformance_test,
  (array_agg(test.testname order by test.release::semver))[1] as test,
  (array_agg(test.codename order by test.release::semver))[1] as codename,
  (array_agg(test.file order by test.release::semver))[1] as file,
  (array_agg(oa.release order by oa.release::semver))[1] as first_release,
  array_remove((array_agg(distinct test.release::semver order by test.release::semver)), null) as all_test_releases
  from
      open_api oa
      left join audit_event ae using(endpoint)
      left join test on (ae.test = test.codename)
  where oa.level = 'stable'
  and deprecated is false
  group by 1
  ;
