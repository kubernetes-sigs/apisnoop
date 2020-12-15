begin;
    -- move this to its own block if it works
    CREATE FUNCTION array_distinct(anyarray) RETURNS anyarray AS $f$
  SELECT array_agg(DISTINCT x) FROM unnest($1) t(x);
$f$ LANGUAGE SQL IMMUTABLE;
 select (select release from audit_event order by release limit 1) as latest_release
 \! mkdir -p /tmp/coverage
 \gset
 \set output_file '/tmp/coverage/':latest_release'.json'
 \t
 \a
 \o :output_file
   select * from generate_latest_coverage_json();
 \o
 \o '/tmp/coverage/conformance-progress.json'
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
 \o '/tmp/coverage/conformance-coverage-per-release.json'
 select jsonb_pretty(json_agg(cp)::jsonb) as output_json
   from (
     select * from conformance.coverage_per_release
   )cp;
 \o
 \o '/tmp/coverage/conformance-endpoints.json'
   select jsonb_pretty(json_agg(ce)::jsonb) as output_json from (
   select endpoint,
   first_release as promotion_release,
   case
   when first_conformance_test is not null
   and first_conformance_test::semver < first_release::semver
   then first_release
   else first_conformance_test
   end as tested_release,
   array_distinct(array_agg(test_json.jb order by test_json.jb->>'codename')) as tests
   from           conformance.eligible_endpoint_coverage ec
   left join audit_event using(endpoint)
   left join conformance.test test on (test.codename = audit_event.test)
   left join lateral (
    select 
           jsonb_build_object(
            'testname', testname,
            'codename', test.codename,
            'file', test.file,
            'release', test.release
            ) as jb
            where testname is not null
            group by test.codename, testname
            order by test.codename, testname
   ) test_json on true
   group by endpoint, first_release, first_conformance_test
   order by first_release::semver desc, endpoint) ce;
\o
\o '/tmp/coverage/ineligible_endpoints.json'
  select jsonb_pretty(json_agg(ie)::jsonb)
  from (select * from conformance.ineligible_endpoint order by endpoint) ie ;
\o
\a
\t
commit;
