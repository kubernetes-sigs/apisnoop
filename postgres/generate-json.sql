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
 \a
 \t
 commit;
