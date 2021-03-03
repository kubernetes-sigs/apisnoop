# v1.21

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.


## ****Increase Stable Test Coverage****


### ****KR1 increase new conformant stable endpoints****

In spite of increasing technical challenges:

-   Goal: 22/30 - Stretch Goal: 40
    -   [Read Status, Patch & List APIService +3](https://github.com/kubernetes/kubernetes/pull/97327)
    -   [PodProxyWithPath & ServiceProxyWithPath + 12](https://github.com/kubernetes/kubernetes/pull/95503)
    -   [Update: StatefulSet Replica scaling- Patch Scale +1](https://github.com/kubernetes/kubernetes/pull/98126)
    -   [ReplicaSetScale test to Conformance +3](https://github.com/kubernetes/kubernetes/pull/99282)
    -   [DeploymentScale test to Conformance +3](https://github.com/kubernetes/kubernetes/pull/99281)


### ****KR2 clean-up technical debt****

-   Goal: Clear [debt back to 1.9](https://apisnoop.cncf.io/conformance-progress#coverage-by-release)

6 months of debt to erase! 1.11 +2: {read,patch}ApiregistrationStatus

-   1.10 +5: {replace,patch,list,&#x2026;}Apiregistration
-   4 Endpoints to go
-   These endpoints are block due to a [possible bug](https://github.com/kubernetes/kubernetes/pull/99568)


### What is in the pipeline

Promotion PR to merge next week

-   [Service Status Life Cycle +4](https://github.com/kubernetes/kubernetes/pull/98018) Ready for approval
-   [Write ReplicaSet Replace and Patch Test +2](https://github.com/kubernetes/kubernetes/pull/99380) Ready for promotion on 11 March
-   [AppsV1DaemonSet resource lifecycle +5](https://github.com/kubernetes/kubernetes/issues/90877) a work in progress


### Apps endpoints

-   All the 1.9 Technical debt is in the Apps API group
-   An [Umbrella Issue](https://github.com/kubernetes/kubernetes/issues/98640) was created and we are working with SIG App to erase that debt
-   The cover for [Apps endpoints](https://apisnoop.cncf.io/1.21.0/stable/apps) moved from 48% in 1.20 to [62%](https://apisnoop.cncf.io/1.21.0/stable/apps) in 1.21


### Taking ownership to the community

-   ii currently manage the Ineligible endpoints list
-   This is done via SQL queries in APISnoop
-   We proposed in SIG Architecture to move it to the community
-   [PR #98677](https://github.com/kubernetes/kubernetes/pull/98677) will make it happen


## ****Other Important News****


### ****Timelines****

-   1.21 [Time line is out](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.21#timeline)
-   14 week cycle with Test freeze on 24 March


### ****Conformance Gate****

-   We experienced some issues due to changes made to the 1.20 release branch

after the release was cut.

-   It was fixed with [PR99081](https://github.com/kubernetes/kubernetes/pull/99081/)
-   The community is currenly looking at ways to protect release branches in Github


### The Conformance goal for 2021

-   Increase Stable Test Coverage for Kubernetes for 2021
    -   Less than 75 untested eligible stable GA endpoints remaining.
    -   Ensure no new technical debt is incurred.


### KubeCon + CloudNativeCon Europe

We will present a Maintainer Track Sessions on Conformance progress and it&rsquo;s importance. Wednesday May 5, 2021 12:20 CEST


## ****Blockers for 1.21****

-   Keep same goals as 1.20
-   Know that Endpoints get tougher
-   Status endpoints is currently a big community topic


## ****Questions / Feedback****

In what other ways can we support the CNCF?
