\set load_k8s_data null
\getenv load_k8s_data LOAD_K8S_DATA
select :load_k8s_data is not null as proceed;
\gset

\if :proceed
begin;
\t
\a
\o '/tmp/untested-endpoints.txt'

  with latest_release as (
  select release::semver as release
    from open_api
   order by release::semver desc
   limit 1
  )

  select endpoint
    from conformance.new_endpoint ne
           join latest_release on ne.release::semver = latest_release.release
where tested is false;
\o
\a
\t
select 'untested endpoints for '||release||' written to /tmp/untested-endpoints.txt' as "build log"
  from open_api
 order by release::semver desc
 limit 1;
commit;
\else
 select 'skipping as envvar LOAD_K8S_DATA is not set' as "build log";
\endif
