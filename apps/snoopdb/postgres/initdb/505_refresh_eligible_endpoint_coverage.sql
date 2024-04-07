\set load_k8s_data null
\getenv load_k8s_data LOAD_K8S_DATA
select :load_k8s_data is not null as proceed;
\gset

\if :proceed
begin;
refresh materialized view conformance.eligible_endpoint_coverage;
select 'conformance.eligible_endpoint_coverage re-materialized' as "build log";
commit;
\else
 select 'skipping as envvar LOAD_K8S_DATA is not set' as "build log";
\endif
