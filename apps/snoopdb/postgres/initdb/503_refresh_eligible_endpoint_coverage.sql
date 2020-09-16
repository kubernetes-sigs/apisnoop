begin;
refresh materialized view conformance.eligible_endpoint_coverage;
select 'conformance.eligible_endpoint_coverage re-materialized' as "build log";
commit;
