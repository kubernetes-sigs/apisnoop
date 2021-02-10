
# v1.21

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

In spite of increasing technical challenges:

-   Goal: 15/30 - Stretch Goal: 40
-   Status Merged: -[ #97327](https://github.com/kubernetes/kubernetes/pull/97327) + 3 -[ #98897](https://github.com/kubernetes/kubernetes/pull/98897) +12

### ****KR2 clean-up technical debt****

-   Goal: Clear [debt back to 1.9](https://apisnoop.cncf.io/conformance-progress#coverage-by-release)

6 months of debt to erase! 1.11 +2: {read,patch}ApiregistrationStatus

-   1.10 +5: {replace,patch,list,&#x2026;}Apiregistration
-   4 Endpoints to go
-   Still in progress, but not there yet.

### What is in the pipeline

-   [Service Status Life Cycle +2](https://github.com/kubernetes/kubernetes/pull/98018) Ready for approval
-   [Update: StatefulSet Replica scaling- Patch Scale +1](https://github.com/kubernetes/kubernetes/pull/98126) Ready of approval to merge into conformance
-   [AppsV1DaemonSet resource lifecycle +5](https://github.com/kubernetes/kubernetes/issues/90877) a work in progress
-   [Write Read, Replace and Patch ReplicaSetScale +3](https://github.com/kubernetes/kubernetes/issues/98920)
-   [Write Read, Replace and Patch DeploymentScale +3](https://github.com/kubernetes/kubernetes/issues/98936) Two new issue 2 to address Apps endpoints in 1.9

### Apps endpoints

-   All the 1.9 Technical debt is in the Apps API group
-   An [Umbrella Issue](https://github.com/kubernetes/kubernetes/issues/98640) was created and we are working with SIG App to erase that debt

## ****Release Blocking k/k Job****

### ****Progress****

-   Gate keeping for new untested endpoints are working
    -   3 New untested endpoints detected in 1.21
    -   These were promoted to [support Alpha features](https://github.com/kubernetes/kubernetes/pull/97276)
    -   The endpoints was mark as "Not eligible for conformance yet"

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

-   We confirmed that Taylor can remove labels
-   Removing labels trigger automatic relabel of the PR

### The Conformance goal for 2021

-   Increase Stable Test Coverage for Kubernetes for 2021
    -   Less than 75 untested eligible stable GA endpoints remaining.
    -   Ensure no new technical debt is incurred.

### KubeCon + CloudNativeCon Europe

We have again submitted a proposal to present a Maintainer Track Sessions on Conformance progress and it's importance.

## ****Blockers for 1.21****

-   Keep same goals as 1.20
-   Know that Endpoints get tougher
-   Status endpoints is currently a big community topic

## ****Questions / Feedback****

In what other ways can we support the CNCF?
