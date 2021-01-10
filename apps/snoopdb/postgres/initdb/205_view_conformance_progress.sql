create or replace view conformance.progress as
    with endpoints_per_release as (-- this filters out endpoints that were dropped after the release
      select release, endpoint
        from      open_api
       inner join conformance.eligible_endpoint using(endpoint)
    )
    select distinct
      epr.release::semver,
      count(*) filter (where epr.release = coverage.first_release) as new_endpoints,
      (select count(*) from conformance.test where conformance.test.release = epr.release) as new_tests,
      count(*) filter (
        where epr.release = coverage.first_release
        and coverage.all_test_releases @> array[epr.release::semver]
      ) as new_endpoints_promoted_with_tests,
      count(*) filter (
        where epr.release = coverage.first_release
        and coverage.first_conformance_test = coverage.first_release
      ) as new_endpoints_covered_by_new_tests,
      count(*) filter (
      where coverage.first_release = epr.release
      and coverage.first_conformance_test::semver < epr.release::semver
      ) new_endpoints_covered_by_old_tests,
      count(*) filter (
        where coverage.first_release::semver < epr.release::semver
          and coverage.first_conformance_test = epr.release
      ) old_endpoints_covered_by_new_tests,
      count(*) as total_endpoints,
      count(*) filter (
        where coverage.first_release::semver <= epr.release::semver
        and coverage.first_conformance_test::semver <= epr.release::semver
      ) as total_tested_endpoints,
      count(*) filter (
        where coverage.first_release = epr.release
        AND coverage.first_conformance_test is null
      ) endpoints_still_untested_today
    from      endpoints_per_release epr
    left join conformance.eligible_endpoint_coverage coverage using (endpoint)
    where release::semver >= '1.8.0'::semver
    group by epr.release
    order by epr.release::semver;

comment on view conformance.progress is 'per release, the # of new, eligible endpoints and coverage ratios';

comment on column conformance.progress.release is 'the kubernetes release';
comment on column conformance.progress.new_endpoints is '# of eligible endpoints promoted to stable in this release';
comment on column conformance.progress.new_tests is '# of tests promoted to conformance this release';
comment on column conformance.progress.new_endpoints_promoted_with_tests is '# of new endpoints hit by a new test, meaning the test and endpoint were promoted in tandem';
comment on column conformance.progress.new_endpoints_covered_by_new_tests is '# of new endpoints whose first test is one that was promoted this release';
comment on column conformance.progress.new_endpoints_covered_by_old_tests is '# of new endpoints that were hit by an existing test';
comment on column conformance.progress.old_endpoints_covered_by_new_tests is '# old endoints hit for the first time by a test from this release.  This shows the payment of technical debt';
comment on column conformance.progress.total_tested_endpoints is 'total # of eligible endopints hit by tests';
comment on column conformance.progress.endpoints_still_untested_today is '# of new endopints from this release that are unhit as of the present day';

select 'conformance.conformance_progress defined and commented' as "build log";
