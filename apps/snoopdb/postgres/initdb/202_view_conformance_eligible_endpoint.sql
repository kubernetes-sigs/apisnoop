     create or replace view conformance.eligible_endpoint as
          select endpoint
            from open_api
                   join (
                     select release
                       from open_api
                      order by release::semver desc
                      limit 1) latest using(release)
           where level = 'stable'
          except
          select endpoint
            from open_api
           where path ~~ any('{"%volume%", "%storage%"}')
              or deprecated is true
              or k8s_kind = 'ComponentStatus'
              or (k8s_kind = 'Node' and k8s_action = any('{"delete", "post"}'))
              or endpoint = any('{"getFlowcontrolApiserverAPIGroup", "createCoreV1NamespacedServiceAccountToken", "getInternalApiserverAPIGroup"}');

      comment on view conformance.eligible_endpoint is 'all current stable endpoints for which conformant tests could be written, following conformance guidelines';

      comment on column conformance.eligible_endpoint.endpoint is 'the endpoint, as its defined in the open_api table';

     select 'conformance.eligible_endpoint defined and commented' as "build log";
