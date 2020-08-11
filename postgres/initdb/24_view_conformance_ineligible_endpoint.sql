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
          -- Redirects to other endpoint
          select endpoint,
                 'redirects to other endpoint' as reason,
                 'endpoint ends in PodProxy, NodeProxy, or ServiceProxy' as "sql logic",
               'https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apimachinery/pkg/util/proxy/upgradeaware.go#L206-L218' as link
            from current_stable_endpoints
           where endpoint ~~ any('{"%NodeProxy", "%PodProxy", "%ServiceProxy"}')
        )
        order by reason;
