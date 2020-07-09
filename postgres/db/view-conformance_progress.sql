create view conformance_progress as
  with current_stable_endpoints as (
    select endpoint
      from open_api
     where release = '1.19.0'
       and level = 'stable'
    except
      select endpoint
      from open_api
      where path like '%volume%'
          or path like '%storage%'
          or deprecated is true
          or k8s_kind = 'ComponentStatus'
          or (k8s_kind = 'Node' and k8s_action = any('{"delete", "post"}'))
  ), endpoints_per_release as (-- this filters out endpoints that were dropped after the release
    select release, endpoint
      from       open_api
      inner join current_stable_endpoints using(endpoint)
  )
  select distinct
    epr.release::semver,
    count(*) filter (where epr.release = firsts.first_release) as new_endpoints,
    (select count(*) from test where test.release = epr.release) as new_tests,
    count(*) filter (
      where epr.release = firsts.first_release
      and firsts.all_test_releases @> array[epr.release::semver]
    ) as new_endpoints_promoted_with_tests,
    count(*) filter (
      where epr.release = firsts.first_release
      and firsts.first_conformance_test = firsts.first_release
    ) as new_endpoints_covered_by_new_tests,
    count(*) filter (
    where firsts.first_release = epr.release
    and firsts.first_conformance_test::semver < epr.release::semver
    ) new_endpoints_covered_by_old_tests,
    count(*) filter (
      where firsts.first_release::semver < epr.release::semver
        and firsts.first_conformance_test = epr.release
    ) old_endpoints_covered_by_new_tests,
    count(*) as total_endpoints,
    count(*) filter (
      where firsts.first_release::semver <= epr.release::semver
      and firsts.first_conformance_test::semver <= epr.release::semver
    ) as total_tested_endpoints,
    count(*) filter (
      where firsts.first_release = epr.release
      AND firsts.first_conformance_test is null
    ) endpoints_still_untested_today
  from      endpoints_per_release epr
  left join stable_endpoint_first firsts on (epr.endpoint = firsts.endpoint)
  group by epr.release
  order by epr.release::semver;
