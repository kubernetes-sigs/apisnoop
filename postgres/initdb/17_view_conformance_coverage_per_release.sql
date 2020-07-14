create or replace view conformance.coverage_per_release as
          with endpoints_per_release as (
            select release, endpoint
              from       open_api
              inner join conformance.eligible_endpoint using(endpoint)
          ), counts as (
          select distinct epr.release::semver,
                 count(*) filter (where epr.release = firsts.first_release) as new_endpoints,
                 count(*) filter (where epr.release = firsts.first_release and first_conformance_test is not null) as tested,
                 count(*) filter (where epr.release = firsts.first_release and first_conformance_test is null) as untested
          from      endpoints_per_release epr
          left join conformance.eligible_endpoint_coverage firsts on (epr.endpoint = firsts.endpoint)
         group by epr.release
         order by epr.release::semver
       )
          select release,
                 new_endpoints as "new endpoints",
                 tested,
                 untested,
                 sum(tested) over (order by release::semver) as "total tested",
                 sum(untested) over (order by release::semver) as "total untested",
                 sum(new_endpoints) over (order by release::semver) as "total endpoints"
            from counts;
    ;

comment on view conformance.coverage_per_release is 'Per release, # of eligible endpoints from that release that are tested today along with useful running tallies.';

comment on column conformance.coverage_per_release.release is 'the given kubernetes release';
comment on column conformance.coverage_per_release.tested is '# of endpoints from this release that are tested today';
comment on column conformance.coverage_per_release.untested is '# of endpoints from this release that are untested today.';
comment on column conformance.coverage_per_release."new endpoints" is '# of endpoints introduced in this release';
comment on column conformance.coverage_per_release."total tested" is '# of total tested endpoints from this release and earlier. will be higher than conformance.progress as it includes endpoints hit by tests introduced in a later release.';
comment on column conformance.coverage_per_release."total untested" is '# of total untested endpoints from this release and earlier';
comment on column conformance.coverage_per_release."total endpoints" is '# of total endpoints at time of release';
