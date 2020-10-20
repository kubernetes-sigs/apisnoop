
# v1.20

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Update for 1.20

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

-   Goal: 30 - Stretch Goal: 40
-   Current Status +19 (written):
    -   [+7 ReplicationController (Prome PR)](https://github.com/kubernetes/kubernetes/pull/95713)
    -   [+12 {Pod,Service}ProxyW/Path (Test PR)](https://github.com/kubernetes/kubernetes/pull/95503)
    -   [+4 NodeProxyWithPath (Issue)](https://github.com/kubernetes/kubernetes/issues/95524)

### Intermittent Flakes

Refactoring / Revisiting Flakey Tests

-   [+4 Pod+PodStatus Lifecycle](https://github.com/kubernetes/kubernetes/pull/93459)
-   [+6 AppV1Deployment Lifecycle](https://github.com/kubernetes/kubernetes/pull/93458)

+17 being reviewed maybe 1.20

### "missing" Conformance tests

Default audit policy filters **Event** endpoints

-   [Support patching default **ADVANCED AUDIT POLICY** #19613](https://github.com/kubernetes/test-infra/issues/19613#issuecomment-711723310)

+7 endpoints: Once the policy is updated

**Pivot:** new ci-audit-conformance

-   based on ci-kind-conformance

### Proxy Redirect: Bugs Discovered

[Limit Apiserver Proxy Redirects](https://github.com/kubernetes/kubernetes/pull/95128) fix bugs

-   [PodProxy redirect test +7 Endpoint coverage](https://github.com/kubernetes/kubernetes/issues/92950)
-   [NodeProxy Redirect Test +7 endpoint coverage](https://github.com/kubernetes/kubernetes/issues/92950)

+14 endpoints unlikely for 1.20

### Conclusion

Still looking on target, even as our testing hit edge cases via flakes, policies, and redirects.

-   Flakes are difficult
-   Policy changes are slow
-   Proxy Redirect has bugs

### ****KR2 clean-up technical debt****

-   Goal: [Cleared](https://apisnoop.cncf.io/conformance-progress#coverage-by-release) debt back to 1.15
-   Stretch Goal: Clear debt to 1.14
-   5 endpoints remain for 1.14
-   Promoting in a week [Priority Lifecycle](https://github.com/kubernetes/kubernetes/pull/95340#issuecomment-708034855)
-   Would clean techical debt back to 1.11

## ****Release Blocking k/k Job****

### ****Progress****

-   The job within [k/test-infra#19173](https://github.com/kubernetes/test-infra/pull/19173) is runnig on [prow.cncf.io](https://prow.cncf.io/)
-   Caught new untested endpoint
-   SIG Network wants one [k/test-infra/#19160](https://github.com/kubernetes/test-infra/issues/19160)
    -   to own Conformance of their API's
    -   APISnoop gains community traction

### ****Status update****

-   prow.k8s.io job failing:
    -   [apisnoop-conformance-gate](https://prow.k8s.io/?job=apisnoop-conformance-gate)
-   prow.cncf.io job succeeds:
    -   [apisnoop-conformance-gate](https://prow.cncf.io/?job=apisnoop-conformance-gate)
-   engaging with SIG-Testing

## ****Other Important News****

### ****Timeline****

-   1.20 [Timeline](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.20#timeline) is avalible
    -   As expected, it will be a short cycle
    -   Code freeze 12 November 2020
    -   Release date 8 December 2020

### ****Conformance Gate****

-   cncf/k8s-conformance gate is running

### ****KubeCon + CloudNativeCon North America 2020 Virtual****

ii speaking at the Maintainer Track Sessions

-   Contributing to Kubernetes Conformance Coverage
-   November 19th - <https://sched.co/ekHw>

## ****Questions / Feedback****
