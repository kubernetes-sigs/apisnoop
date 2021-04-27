# v1.21

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.


## ****Increase Stable Test Coverage****


### ****KR1 increase new conformant stable endpoints****

In spite of increasing technical challenges:

-   Goal: 28/30 - Stretch Goal: 40
    -   [Read Status, Patch & List APIService +3](https://github.com/kubernetes/kubernetes/pull/97327)
    -   [Pod- & ServiceProxyWithPath + 12](https://github.com/kubernetes/kubernetes/pull/95503)
    -   [StatefulSet Replica scaling +1](https://github.com/kubernetes/kubernetes/pull/98126)
    -   [ReplicaSetScale test +3](https://github.com/kubernetes/kubernetes/pull/99282)
    -   [DeploymentScale test +3](https://github.com/kubernetes/kubernetes/pull/99281)
    -   [Service Status Life Cycle +4](https://github.com/kubernetes/kubernetes/pull/98018)
    -   [ReplicaSet Replace and Patch Test +2](https://github.com/kubernetes/kubernetes/pull/99380)


### ****KR2 clean-up technical debt****

-   Goal: Clear [debt back to 1.9](https://apisnoop.cncf.io/conformance-progress#coverage-by-release)

6 months of debt to erase! 1.11 +2: {read,patch}ApiregistrationStatus

-   1.10 +5: {replace,patch,list,&#x2026;}Apiregistration
-   4 Endpoints to go
-   These endpoints are block due to a [possible bug](https://github.com/kubernetes/kubernetes/pull/99568)


### What is in the pipeline

-   [Write AppsV1DaemonSetStatus test - +3 endpoints #100507](https://github.com/kubernetes/kubernetes/pull/94786)
-   [Write PodProxy Redirect Test - +7 endpoint coverage #94786](https://github.com/kubernetes/kubernetes/pull/94786)


### Apps endpoints

-   All the 1.9 Technical debt is in the Apps API group
-   An [Umbrella Issue](https://github.com/kubernetes/kubernetes/issues/98640) was created and we are working with SIG App to erase that debt
-   The cover for [Apps endpoints](https://apisnoop.cncf.io/1.21.0/stable/apps) moved from 48% in 1.20 to [62%](https://apisnoop.cncf.io/1.21.0/stable/apps) in 1.21


### Taking ownership to the community

-   ii currently manage the Ineligible endpoints list
-   This is done via SQL queries in APISnoop
-   SIG Architecture agreed to move it to the community
-   [PR #98677](https://github.com/kubernetes/kubernetes/pull/98677) will make it happen
-   APISnoop functionallity will be updated in 1.22


### Beta Endpoints graduation to GA

-   32 new endpoints to GA
-   Endpoints for:
    -   CronJob
    -   EndpointSlice
    -   PodDisruptionBudget


## ****Other Important News****


### ****Timelines****

-   1.22 timeline is not avalble yet
-   It should be another 14 week cycle


### ****Conformance Gate****

-   We experienced some issues due to changes made to the 1.20 release branch

after the release was cut.

-   It was fixed with [PR99081](https://github.com/kubernetes/kubernetes/pull/99081/)
-   Block conformance changes on release branches in k/k [#21082](https://github.com/kubernetes/test-infra/pull/21082) was intruduced to protect release branches
-   [#21092](https://github.com/kubernetes/test-infra/pull/21092) reverted the change an must be revisited in 1.22


### The Conformance goal for 2021

-   Increase Stable Test Coverage for Kubernetes for 2021
    -   Less than 75 untested eligible stable GA endpoints remaining.
    -   Ensure no new technical debt is incurred.
    -   At the end of 1.22 there is 123 endpoints remaining


### KubeCon + CloudNativeCon Europe

ii will present a Maintainer Track Sessions on Conformance progress and it&rsquo;s importance. Wednesday May 5, 2021 12:20 CEST


## ****Traget for 1.22****

-   Conformance tests for 20 previously untested endpoints


## ****Blockers for 1.22****

-   Know that Endpoints get tougher
-   Status endpoints is currently a big community topic


## ****Questions / Feedback****

In what other ways can we support the CNCF?
