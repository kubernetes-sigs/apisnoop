
# v1.19

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## June News

### ****SIG-Release 1.19 [Timelines](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19#timeline)****

-   ****Tests need to be in this Week 15**** (July 23)

Tests need two weeks soak!

-   ****Test Freeze Week 17**** (August 6th)

### ****APISnoop Endpoint Gate****

-   Front Page is now notes new endpoints
-   Shows untested / tested / conformance
-   Feedback: use front page as link

### ****+35 Old Endpoints Likely Conformant****

-   Total of 35 Endpoints likely (45 still possible)
-   +14 - Merged Conformance tests
-   +21 - Soaking Conformance tests
-   +10 - 2 Tests may merge this week

### ****+41 New Endpoint Conformant****

-   <https://apisnoop.cncf.io/1.19.0/stable>
-   41 Endpoints promoted from Beta
    -   +32 @liggitt's team merged 2 Conformance Test
    -   +7 @Wojtek-t's team merged 1 conformance Test
    -   +1 @ii team merged 1 Conformance Test
    -   +1 @Wojtek-t's team final test in PR/soaking

### ****Preventing further technical debt****

-   Two Endpoint graduated from Beta to GA sans Confromance
-   Manually caught by the ii team in APISnoop
    -   +1 [#93038](https://github.com/kubernetes/kubernetes/pull/93038) ii merged
    -   +1 [#93296](https://github.com/kubernetes/kubernetes/pull/93296#issuecomment-662593955) @Wojtek-t's team's

### ****9.61% increase in coverage since 1.18****

-   38.86% - 1.18 coverage = 150/386
-   48.47% - 1.19 coverage = 207/427

### ****APISnoop Database Image****

-   SnoopDB (openAPI spec + conformance coverage)
    -   coverage data taken from e2e test suite runs
    -   used for CI / coverage updates
    -   used for research and issue creation

### ****APISnoop enhancements****

-   New endpoints for each release beneath sunburst

-   Coverage at Time Of Release (Percentage)

-   Automating the updates our coverage

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

-   Verify Release
    -   [X] ****release-X.Y****
    -   [X] ****needs-release**** w/ Comments
-   Verify Tests
    -   [ ] ****tests-run-X.Y****
    -   [ ] ****needs-tests**** w/ Comments

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

### ****KR1 (14/40) new conformant stable endpoints****

+21 soaking for 1.19 for (35/40)

-   \#89753 + 5 points
-   \#90390 + 3 points
-   \#90812 + 1 point
-   \#90941 + 2 points
-   \#92813 + 1 point
-   \#93084 + 1 point
-   \#93038 + 1 point Ingress Endpoint

### ****KR2 (9.61% / +9%) Coverage Increase****

****38.86%->48.47%****

-   Target have been exceeded with ii and the community's effort
-   Further increase expected before 1.19 test freeze
-   Due to increase in total endpoints, our increase may be hidden.

Percentage many not be a clear indicator.

### ****KR3 (stretch +49) 50% stable endpoints hit by conformance tests****

-   Possible, only need Conformance tests for 7 more Endpoints to Merge

## Next Conformance Meeting

-   Review OKRs for 1.19
-   Discuss OKRs for 1.20
-   Feedback?
