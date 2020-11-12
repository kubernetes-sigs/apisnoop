     create or replace view conformance.eligible_endpoint as
          select endpoint
            from open_api
                   join (
                     select release
                       from open_api
                      order by release::semver desc
                      limit 1) latest using(release)
           where level = 'stable'
           and deprecated is not true
          except
          select endpoint
            from conformance.ineligible_endpoint;

      comment on view conformance.eligible_endpoint is 'all current stable endpoints for which conformant tests could be written, following conformance guidelines';

      comment on column conformance.eligible_endpoint.endpoint is 'the endpoint, as its defined in the open_api table';

     select 'conformance.eligible_endpoint defined and commented' as "build log";
