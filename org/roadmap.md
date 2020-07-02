
# v1.19

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## June News

### SIG-Release 1.19 [Timelines](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19#timeline) due to Covid

-   Dates [may yet again slip](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!msg/kubernetes-dev/TVXhcNO3SPU/-Uj-xJP2BQAJ), not confirmed
-   Tests need to be in Week 14 (July 16th)
-   Test Freeze Week 16 (July 30th)

### prow.cncf.io

-   Created [github.com/cncf-infra](https://github.com/cncf-infra) org
-   [prow-config](https://github.com/cncf-infra/prow-config) has two plugins
    -   verify-conformance-release
    -   verify-conformance-tests
-   Test PRs in fork of [k8s-conformance](https://github.com/cncf-infra/k8s-conformance/pulls)

### 14 + 18 Tested Endpoints released to Stable

-   Total of 32 Endpoints promoted from beta
-   With conformance test,by the community
-   [#91685](https://github.com/kubernetes/kubernetes/pull/91685) CertificateSigningRequestV1 API
-   [#91996](https://github.com/kubernetes/kubernetes/pull/91996) Ingress:CRUD API tests for v1 to conformance
    -   ****note links to [APISnoop.cncf.io](https://apisnoop.cncf.io)****
    -   Shouts out to ****[@liggitt](https://github.com/liggitt)****

### 5.12% increase in coverage since April News

-   All because Beta endpoints to GA
    -   included all conformance tests!
-   Current coverage: 40.82% = 180/450
-   Previous coverage 35.70% = 146/409

### Watch Tooling Refactoring

-   Consensus was to [merge ](https://github.com/kubernetes/kubernetes/pull/91416#issuecomment-645064347)and iterate
-   [Issue #90957](https://github.com/kubernetes/kubernetes/issues/90957) will continue discussion
-   [PR #92621](https://github.com/kubernetes/kubernetes/pull/92621/) Simplify ConfigMap lifecycle e2e test by @spiffxp Under review as an alternative to Watch Tooling

### +29 Endpoints Backlogged by Tooling Requests

-   [Watch Tooling](https://github.com/kubernetes/kubernetes/issues/90957) Summary
    -   Initial Tooling Approach Merged! [#91416](https://github.com/kubernetes/kubernetes/pull/91416#issuecomment-645064347)
    -   Existing Test PRs: +23
        -   Promotion #90941 & #90939 (+6)
        -   In progress #90942, #90988# #92589 (+17)
    -   Triage 1 Issues: +6

### Conformance coverage progress

-   @liggitt merged 2 Conformance Test +32 Endpoints
-   ii merged 2 Conformance Tests +8 Endpoints
-   ii has 5 test open (4 PR's + 1 Issues) +29 Endpoints
    -   dependant on Tooling Watch tooling (Potential + 6.83%)
-   ii has 5 test indipendant of Watch tooling +20 Endpoints

### Historical Endpoint and Conformance data

-   Two [graphs](https://www.instantinfrastructure.com/snoop/) have been prepared using the following underling data:
    -   New [Conformance.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/conformance.yaml)
    -   1.9-1.18 release tags for OpenAPI json
    -   Latest release-blocking prow job audit.log

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
-   [ ] List of tests from junit.xml and compare with requiered test
-   [ ] List of tests from e2e.log and compare to junit.xml
-   [ ] Comment list/count of missing tests
-   [ ] add ****needs-tests**** OR ****tests-run-X.Y****

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

### KR1 (8/40) new conformant stable endpoints

-   \#89753 + 5 points
-   \#90390 + 3 points
-   \#91416 Add watch event tooling

### KR2 +9% Coverage Increase 36.46%->45.46%

Due to increase in total endpoints, our increase may be hidden. Percentage many not be a clear indicator.

-   34.15%->38.30% => +3.85%
-   36.46%->38.30% => +1.84%

### KR3 (stretch +49) 50% stable endpoints hit by conformance tests

-   Possibly, but it will be a stretch
