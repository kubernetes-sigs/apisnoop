
# v1.19

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## June News

### ****SIG-Release 1.19 [Timelines](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19#timeline) due to Covid****

-   Dates [may yet again slip](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!msg/kubernetes-dev/TVXhcNO3SPU/-Uj-xJP2BQAJ), not confirmed
-   Tests need to be in Week 14 (July 16th)
-   Test Freeze Week 16 (July 30th)

### ****prow.cncf.io****

-   Created [github.com/cncf-infra](https://github.com/cncf-infra) org
-   [prow-config](https://github.com/cncf-infra/prow-config) has two plugins
    -   verify-conformance-release
    -   verify-conformance-tests
-   Test PRs in fork of [k8s-conformance](https://github.com/cncf-infra/k8s-conformance/pulls)

### ****Increase in coverage for 1.19 over 1.18 Stable****

-   Total of 33 Endpoints promoted from beta
-   32 Endpoints promoted with test
-   11 Endpoint hit by ii

### ****7.74% increase in coverage since 1.18****

-   1.18 coverage 38.86% = 150/386
-   Current 1.19 coverage: 46.60% = 199/427

### ****Watch Tooling Refactoring****

-   [PR #92621](https://github.com/kubernetes/kubernetes/pull/92621/) Simplify ConfigMap lifecycle e2e test by @spiffxp
-   In Conformance Office Hours Meeting of 14 July it was agreed to follow the approach proposed by Aaron. The results will be evaluated as we go forward

### ****+29 Endpoints Backlogged by Tooling Request****

-   Existing Test PRs: +21
    -   Promotion #90939 (+4)
    -   In progress #90942,#90988,#92589 (+17)
-   Triage 1 Issues: +8

### ****Conformance coverage progress****

-   @liggitt merged 2 Conformance Test +32 Endpoints
-   ii merged 4 Conformance Tests +11 Endpoints
-   4 Promotions +7 Endpoints
    -   1 of 4 Endpoints for Watch Tooling
-   5 Test +34 Endpoints
    -   3 of 17 Endpoints for Watch Tooling
-   2 Issues of 8 Endpoints in Backlog for Watch Tooling

### ****Summery****

| Status:             | Endpoints  | Blocked-Watch tooling |
|------------------- |---------- |--------------------- |
| Promotion:          | 7          | 4                     |
| Tests:              | 34         | 19                    |
| Backlog:            | 8          | 8                     |
| ****Total Open:**** | ****49**** | ****31****            |
| Merge:              | 11         |                       |
| ****Total:****      | ****60**** |                       |

### Conformance and Historical Endpoint data\*\*

-   [apisnoop.cncf.io](https://apisnoop.cncf.io) been updated
    -   First page show the sunburst graph at the top of the page
        -   With data from 1.15 on wards
    -   Confromance progress is shown in 3 graphs
        -   Stable Endpoint Coverage At Time of Release
        -   Stable Endpoint Coverage At Time of Release (%)
        -   Conformance Coverage By Release
    -   Historical Endpoint [GET THE CORRECT URL][graphs]]
        -   PR [#1806](https://github.com/kubernetes/community/pull/1806) API's promoted to GA must come with conformance tests

### ****APISnoop updates****

-   Generating yaml and json files for coverage to make it easier for other apps to consume

    -   discussing this in [PR 92631](https://github.com/kubernetes/kubernetes/pull/92631), and last conformance office hours
    -   will likely keep this out of tree, but usefulness of these files feels clear.

### ****New snoop site using our output json files****

-   <https://snoop-app.vercel.app> is preview of new site
-   pulls all data from github repo holding coverage info
    -   can use similar process for prowbots and gates
-   improved routing (navigate via release instead of bucket and job)
-   conformance progress added as new page
-   about page added with more info on our process and update frequency.

### ****Discovered increase in coverage with Serial and Disruption tests****

-   there are a set of conformance tests that were not included in the buckets we drew our testdata from.
-   these tests are being run in a different e2e test run.
-   by combining the data sets, we can see all the conformance tests and which endpoints they hit.

### ****Discovery****

-   doing this work uncovered 17 new endpoints hit by conformance tests.
-   this number is reflected in our new app and on the landing page of apisnoop.cncf.io

### ****Next up****

-   automating the updates of our coverage jsons

-   listing new, untested endpoints sorted by recency

## Gate cncf/k8s-conformance PRs

-   [cncf/k8s-conformance project board](https://github.com/cncf/apisnoop/projects/29)

### KR1 Setup prow.cncf.io

-   [X] DNS prow.cncf.io pointing to prow.apisnoop.io
-   [X] Grant cncf-ci bot permissions to cncf github org
-   [X] Deploy prow onto prow.cncf.io
-   [X] Researching the isolation / clusters used by test-infra / k8s-infra-wg
-   [ ] Look into setting up #wg-cncf-infra if there is interest

### KR2 Connect cncf/k8s-conformance to prow.cncf.io

-   [X] Comments and admin actions from prow.cncf.io
-   [X] Will be made using the [cncf-ci](https://github.com/cncf-ci) bot/github account.
-   [X] Enable [meow](https://github.com/cncf/k8s-conformance/pull/971) and simple prow bot plugins

### KR3 gate+comment

-   Verify Release -[X] ****release-X.Y**** -[X] ****needs-release**** w/ Comments
-   Verify Tests
    -   ****tests-run-X.Y****
    -   ****needs-tests**** w/ Comments

### Verify Release

-   [X] PR Title
-   [X] Folder
-   [X] e2e.log
-   [-] junit.xml
-   [X] PRODUCT.yaml has all required fields
-   [X] add ****needs-release**** OR ****release-X.Y****

### Verify Tests

-   [X] List of tests required for release
-   [X] List of tests from junit.xml and compare with requiered test
-   [X] Comfirm that e2e Log have no failed tests
-   [X] Comment list/count of missing tests
-   [X] add ****needs-tests**** OR ****tests-run-X.Y****

### definition Informed by [user stories for KEP-960](https://github.com/kubernetes/enhancements/blob/2c19ec7627e326d1c75306dcaa3d2f14002301fa/keps/sig-architecture/960-conformance-behaviors/README.md#role-cncf-conformance-program)

    Must confirm the version of the tests being run matches...
    Must confirm the set of tests being run matches...
    Must confirm all behaviors are covered by a test...

## Gate k/k PRs touching test/e2e or API

-   [k/k API+Conformance Gate](https://github.com/cncf/apisnoop/projects/30)

### Background

Influenced by [Behavior KEP user stories](https://github.com/kubernetes/enhancements/pull/1666/files?short_path=92a9412#diff-92a9412ae55358378bc66295cdbea103) while continuing to focus on endpoints!

> Will show increase in endpoints, and tested endpoints, but also, explicitly, whether conformance coverage increased.

> Comment: "you are adding a new endpoint to stable, and you are adding a conformance test for it"

### OKing PR

> Existing responsiblity via owners file ensures that PRs touching swagger or conformance tests are ****/approved**** by right people.

> A label of ****requires-conformance**** will applied, and ****conformance**** label will need to be added by this gate + automation.

### KR1 Identify a PR as requiring conformance review

PR must touch file in conformance-specific directory

-   (initially /area-conformance + /sig-arch)
-   [ ] Create `run_if_changed` presubmit

    eg: update test/conformance/behaviors/..
    eg: mv from test/e2e to test/conformance

### KR2 Identify list of endpoints added/removed

Tooling will compare `path/operation_id` in `api/openapi-spec/swagger.json`

-   [ ] Generate list of new endpoints
-   [ ] Generate list of removed endpoints

### KR3 Run APISnoop against PR to generate endpoint coverage

Tooling will provide a list of tested and conformant endpoints.

-   [ ] Wait for main prow job to finish
-   [ ] Generate list of hit/tested endpoints
-   [ ] Generate list of conformant endpoints

### KR4 bot comment w/ list of increase/decrease of endpoints

Tooling will comment directly on PR

-   [ ] alpha : endpoints needing tests
-   [ ] beta : endpoints needing tests
-   [ ] stable : comment+block via tag

> You've added api's without tests it will not be able to reach stable.

### KR5 Manual Approval for SIG-Arch (or appropriate owners)

Ensure the API Review process has been followed.

-   [ ] Get feedback on approval process from SIG-Arch
-   [ ] Ensure the correct tagging / OWNERS are respected

### KR6 Donate APISnoop to sig-arch

-   [ ] Get feedback if this is desired
-   [ ] Get as to location of repo under k8s org
-   [ ] Migration maybe in Q4

## Increase Stable Test Coverage by 40 endpoints

### KR1 (11/40) new conformant stable endpoints

-   \#89753 + 5 points
-   \#90390 + 3 points
-   \#90812 + 1 point
-   \#92813 + 2 points

### KR2 (7.74% / +9%) Coverage Increase 38.86%->46.60%

Due to increase in total endpoints, our increase may be hidden. Percentage many not be a clear indicator.

### KR3 (stretch +49) 50% stable endpoints hit by conformance tests

-   Possibly, but it will be a stretch
