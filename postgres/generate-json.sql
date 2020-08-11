begin;
 select (select release from audit_event order by release limit 1) as latest_release
 \gset
 \set output_file './resources/coverage/':latest_release'.json'
 \t
 \a
 \o :output_file
   select * from generate_latest_coverage_json();
 \o
 \o './resources/coverage/conformance-progress.json'
 select jsonb_pretty(json_agg(json_build_object(
 'release', release,
 'total', json_build_object(
   'endpoints', total_endpoints,
   'tested', total_tested_endpoints,
   'new', new_endpoints,
   'new_with_tests', new_endpoints_promoted_with_tests,
   'old_tested', old_endpoints_covered_by_new_tests,
   'new_tested', new_endpoints_covered_by_new_tests + new_endpoints_covered_by_old_tests,
   'still_untested', endpoints_still_untested_today
 )
))::jsonb) from conformance.progress;
 \o
 \o './resources/coverage/conformance-coverage-per-release.json'
 select json_agg(cp) as output_json
   from (
     select * from conformance.coverage_per_release
   )cp;
 \o
 \o './resources/coverage/conformance-endpoints.json'
   select json_agg(ce) as output_json from (
   select endpoint,
   first_release as promotion_release,
   case
   when first_conformance_test is not null
   and first_conformance_test::semver < first_release::semver
   then first_release
   else first_conformance_test
   end as tested_release,
   array_agg(distinct jsonb_build_object(
     'testname', testname,
     'codename', test.codename,
     'file', test.file,
     'release', test.release
   )) filter (where testname is not null) as tests
   from           conformance.eligible_endpoint_coverage ec
   left join audit_event using(endpoint)
   left join test on (test.codename = audit_event.test)
   group by endpoint, first_release, first_conformance_test
   order by first_release::semver desc) ce;
\o
\o './resources/coverage/ineligible_endpoints.json'
  select jsonb_pretty(json_agg(ie)::jsonb)
  from (select * from conformance.ineligible_endpoint order by endpoint) ie ;
\o
\a
\t
commit;
