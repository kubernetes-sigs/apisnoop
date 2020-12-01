
# v1.20

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Raw Progress from [APISnoop](https://apisnoop.cncf.io/)

|          | 1.14   | 1.15   | 1.16   | 1.17   | 1.18   | 1.19   | 1.20   |
|-------- |------ |------ |------ |------ |------ |------ |------ |
| Tested   | 68     | 75     | 116    | 143    | 153    | 231    | 263    |
| Untested | 274    | 267    | 253    | 226    | 216    | 179    | 155    |
| Total    | 342    | 342    | 369    | 369    | 369    | 410    | 418    |
| Cover    | 19.88% | 21.93% | 31.44% | 38.75% | 41.46% | 56.34% | 62.92% |

## ****Final update for 1.20****

Test Freeze is here, time for our final results!

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

-   Goal: 30 - Stretch Goal: 40
-   Status +24 (Merged):
    -   [+7 ReplicationController](https://github.com/kubernetes/kubernetes/pull/95713)
    -   [+1 Pod+PodStatus Lifecycle](https://github.com/kubernetes/kubernetes/pull/96485)
    -   [+5 AppV1Deployment Lifecycle](https://github.com/kubernetes/kubernetes/pull/96487)
    -   [+5 PriorityClass endpoints](https://github.com/kubernetes/kubernetes/pull/95884)
    -   [+1 delete/CollectionNamespacedEvent](https://github.com/kubernetes/kubernetes/pull/92813)
    -   [+5 Event resource lifecycle](https://github.com/kubernetes/kubernetes/pull/89753)

### ****Other Conformance news****

-   8 [New Endpoints promoted to GA](https://github.com/kubernetes/enhancements/issues/585#issuecomment-730597609)
    -   [with conformance tests!](https://apisnoop.cncf.io/conformance-progress/endpoints/1.20.0?filter=promotedWithTests)
-   13 NodeProxy endpoints
    -   [Marked as ineligible for conformance](https://apisnoop.cncf.io/conformance-progress/ineligible-endpoints)
    -   Based on [community feedback](https://github.com/kubernetes/kubernetes/issues/95930)

### ****Greater effort after 60%****

-   Getting harder to reach our objectives:
    -   [lots](https://github.com/kubernetes/kubernetes/issues/95920) [of](https://github.com/kubernetes/kubernetes/pull/96485) [deflaking](https://github.com/kubernetes/kubernetes/pull/96487)
    -   [policy changes](https://github.com/kubernetes/kubernetes/pull/95388)
    -   [upstream](https://github.com/kubernetes/kubernetes/pull/95128) [bugs](https://github.com/kubernetes/kubernetes/issues/95129) [fixed](https://github.com/kubernetes/kubernetes/issues/95966)
    -   new [images](https://prow.k8s.io/job-history/gs/kubernetes-jenkins/logs/post-kubernetes-push-e2e-test-images) [built](https://github.com/kubernetes/kubernetes/pull/95503#issuecomment-723488612)
    -   more community [interaction](https://github.com/kubernetes/kubernetes/pull/95781) / [latency](https://github.com/kubernetes/kubernetes/pull/94786#issuecomment-707372603)
-   The remaining endpoints for conformance
    -   are taking more effort

### ****KR2 clean-up technical debt****

-   Goal: Clear debt back to 1.15
-   Stretch Goal: Clear debt to 1.14
-   Actualized: [Cleared back to 1.11!](https://apisnoop.cncf.io/conformance-progress#coverage-by-release)

****Over a year of Technical Debt erased!****

## ****Release Blocking k/k Job****

### ****Progress****

-   Our job [k/test-infra#19173](https://github.com/kubernetes/test-infra/pull/19173)
    -   is runnig on [prow.k8s.io](https://prow.k8s.io/?job=apisnoop-conformance-gate)
    -   is catching untested new endpoints
    -   is gaining community [traction](https://github.com/kubernetes/kubernetes/issues/96524)
    -   [apisnoop-conformance-gate](https://prow.k8s.io/?job=apisnoop-conformance-gate)
-   further automation is in progress

## ****Other Important News****

### ****Timelines****

-   [1.20](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.20#timeline) was a short cycle
    -   Test freeze 23 November 2020
    -   Code freeze 12 November 2020
    -   Release date 8 December 2020
-   1.21 [still under discussion](https://hackmd.io/@1ZEI8TYqTDWogQGLAiExjw/ry-m4YYcP)

### ****Conformance Gate****

-   cncf/k8s-conformance gate is running
    -   Looks [like it's working](https://github.com/cncf/k8s-conformance/pulls?q=is%3Apr+is%3Aclosed)
    -   Feedback from [Taylor Waggoner](https://github.com/taylorwaggoner) welcome

## ****1.20 Conclusions****

-   No new techical debt was allowed!
-   Technical debt cleared back to 1.11
-   +32 new conformant Endpoints!
-   +13 newly ineligible for conformance
-   ~9% eligible coverage increase
    -   1.19: ~54%
    -   1.20: ~63%

## ****Looking forward to 1.21****

-   No radical changes
-   Keep same goals as 1.20
-   Know that Endpoints get tougher

### ****KR1 +30 newly conformant stable endpoints****

In spite of increasing technical challenges:

-   +30 old endpoints with new coverage
-   +40 stretch goal

### ****KR2 clean-up 1.11 and 1.10 technical debt****

6 months of debt to erase!

-   1.11
    -   ****+2: {read,patch}ApiregistrationStatus****
-   1.10
    -   ****+5: {replace,patch,list,&#x2026;}Apiregistration****

## ****Questions / Feedback****

In what other ways can we support the CNCF?
