begin;

from open_api
order by release::semver desc
limit 1;

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
commit;
