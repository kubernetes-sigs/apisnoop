
# v1.21

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

In spite of increasing technical challenges:

-   Goal: 3/30 - Stretch Goal: 40
-   Status: +3 (Merged):
    -   [Read Status, Patch & List APIService +3](https://github.com/kubernetes/kubernetes/pull/97327)

### ****KR2 clean-up technical debt****

-   Goal: Clear [debt back to 1.9](https://apisnoop.cncf.io/conformance-progress#coverage-by-release)

6 months of debt to erase!

-   1.11 +2: {read,patch}ApiregistrationStatus
-   1.10 +5: {replace,patch,list,&#x2026;}Apiregistration
-   3 of 7 endpoints are coved by our first merged test for 1.21
-   4 Endpoints to go, looking good!

### What is in the pipeline

-   [PodProxyWithPath & ServiceProxyWithPath test - + 12](https://github.com/kubernetes/kubernetes/pull/95503) Dependent on [Image build](https://prow.k8s.io/job-history/gs/kubernetes-jenkins/logs/post-kubernetes-push-e2e-test-images) to be updated
-   [AppsV1DaemonSet resource lifecycle test - +6](https://github.com/kubernetes/kubernetes/issues/90877)
-   [Service Status Life Cycle test - +2](https://github.com/kubernetes/kubernetes/pull/98018)
-   All the 1.9 Technical debt is in the Apps API group
-   We are working with SIG App to erase that debt

## ****Release Blocking k/k Job****

### ****Progress****

-   Our job [k/test-infra#19173](https://github.com/kubernetes/test-infra/pull/19173)
    -   is running on [prow.k8s.io](https://prow.k8s.io/?job=apisnoop-conformance-gate)
    -   is catching untested new endpoints
    -   3 New untested endpoints detected in 1.21
    -   We are engaging the community ensure promotion with conformance tests
    -   further automation is in progress

## ****Other Important News****

### ****Timelines****

-   1.21 [still under discussion](https://hackmd.io/@1ZEI8TYqTDWogQGLAiExjw/ry-m4YYcP)
-   Consideration between 3 or 4 releases per year ongoing
-   Should be agreed shortly

### ****Conformance Gate****

-   cncf/k8s-conformance gate is running
    -   Looks [like it's working](https://github.com/cncf/k8s-conformance/pulls?q=is%3Apr+is%3Aclosed)
    -   Discussion point: Labels and removing labels

## ****Looking forward to 1.21****

-   No radical changes
-   Keep same goals as 1.20
-   Know that Endpoints get tougher

## ****Questions / Feedback****

In what other ways can we support the CNCF?
