create or replace view conformance.ineligible_endpoint as
with current_stable_endpoints as (
  select endpoint, path, k8s_kind, k8s_action
    from open_api
   where deprecated is false
     and level = 'stable'
     and release = (
       select release
         from open_api
        order by release::semver desc
        limit 1
     )
)
(
    -- vendor specific features
    select endpoint,
            'vendor specific feature' as reason,
            'path includes "volume" or "storage"' as "sql logic",
        'https://github.com/kubernetes/community/blame/master/contributors/devel/sig-architecture/conformance-tests.md#L64' as link
    from current_stable_endpoints
    where path ~~ any('{"%volume%", "%storage%"}')
)
union
(
    -- endpoint is pending deprecation
    select endpoint,
            'pending deprecation' as reason,
            'kind equals ComponentStatus' as "sql logic",
        'https://github.com/kubernetes/community/blame/master/contributors/devel/sig-architecture/conformance-tests.md#L69' as link
    from current_stable_endpoints
    where k8s_kind = 'ComponentStatus'
)
union
(
    -- Uses the kubelet api
    select endpoint,
            'uses kubelet api' as reason,
            'kind equals Node and action equals delete or post' as "sql logic",
        'https://github.com/kubernetes/community/blame/master/contributors/devel/sig-architecture/conformance-tests.md#L36' as link
    from current_stable_endpoints
    where k8s_kind = 'Node'
        and k8s_action = any('{"delete", "post"}')
)
union
(
-- Optional feature
select endpoint,
'optional feature' as reason,
'endpoint = ' || endpoint as "sql logic",
'https://github.com/kubernetes/kubernetes/issues/80770' as link
from current_stable_endpoints
where endpoint = 'createCoreV1NamespacedServiceAccountToken'
)
union
(
-- Dependent on Alpha Feature
select endpoint,
'depends on alpha feature' as reason,
'endpoint = ' || endpoint as "sql logic",
'https://github.com/kubernetes/enhancements/blob/f16c4c7f1c9e28a3cc4bb4d0e6503efea2ae7987/keps/sig-api-machinery/20190228-priority-and-fairness.md' as link
from current_stable_endpoints
where endpoint = 'getFlowcontrolApiserverAPIGroup'
)
union
(
-- Not eligible for conformance yet
select endpoint,
'Not eligible for conformance yet' as reason,
'endpoint = ' || endpoint as "sql logic",
'https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/20190802-dynamic-coordinated-storage-version.md' as link
from current_stable_endpoints
where endpoint =  'getInternalApiserverAPIGroup'
)
union
(
-- Unable to be tested, and likely to be deprecated
select endpoint,
'Unable to be tested, and likely soon deprecated' as reason,
'k8s_kind = "NodeProxyOptions"'  "sql logic",
'https://github.com/kubernetes/kubernetes/issues/95930' as link
from current_stable_endpoints
where k8s_kind = 'NodeProxyOptions'
)
order by reason;

comment on view conformance.ineligible_endpoint is 'endpoints ineligible for conformance testing and the reason for ineligibility.';

comment on column conformance.ineligible_endpoint.endpoint is 'the ineligible endpoint';
comment on column conformance.ineligible_endpoint.reason is 'reason, from conformance guidelines, for ineligibility';
comment on column conformance.ineligible_endpoint."sql logic" is 'how we tested reason using sql';
comment on column conformance.ineligible_endpoint.link is 'url source for reason';

select 'conformance.ineligible_endpoint defined and commented' as "build log";
