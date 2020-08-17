
# v1.20

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Looking back at 1.19

### ****Gate cncf/k8s-conformance PR's****

-   ****KR1**** Setup prow.cncf.io
-   ****KR2**** Connect cncf/k8s-conformance to prow.cncf.io
-   ****KR3**** gate+comment
-   The Conformance gate is implemented and tested on [cncf-infra/k8s-conformance](https://github.com/cncf-infra/k8s-conformance/).
-   It is ready to be pointed at [cncf/k8s-conformance](https://github.com/cncf/k8s-conformance/).

### Next steps for cncf/K8s-conformance gate

-   Agree on implementation date
-   Update and improve based on feedback
-   Maintenance strategy

### ****Gate k/k of PR's touching test/e2e or API****

-   This is the key focus for 1.20
-   In progress, setting up infrastructure in AWS

### ****Increase Stable Test Coverage by 40 endpoints****

### ****KR1 (39/40) new conformant stable endpoints****

-   Community introduced 41 New endpoints to GA
-   40 Endpoint was introduced with tests
-   ii introduced Conformance tests for 38 old endpoints
-   ii added a Conformance test to 1 new endpoints promoted without a test

### ****KR2 (17.54% / +9%) Coverage Increase****

****38.86%->56.4%****

-   Target have been exceeded with ii and the community's effort
-   Percentage would not be used as a measure from 1.20
-   Percentage many not be a clear indicator due to:
    -   New endpoints, deprecation and ineligible endpoints etc.

### ****KR3 (stretch 56.4%) +50% stable endpoints hit by conformance tests****

-   Achieved by the team work of ii and the community

### ****Achievements not in OKRs for 1.19****

### Preventing further technical debt

-   Two Endpoints graduated from Beta to GA sans Conformance
-   Both endpoints was pick-up by APISnoop and Conformance tests where add in 1.19
-   No new technical debt

### APISnoop improvements in 1.19

-   New endpoints for each release beneath sunburst
-   Progress graph toggle between percentage and numbers
-   SnoopDB (openAPI spec + conformance coverage)
-   Coverage data taken from e2e test suite runs
-   Used for CI / coverage updates
-   Used for research and issue creation

## Looking forward to 1.20

## ****Gate cncf/k8s-conformance PRs****

-   The next steps for production implementation must be agreed

## ****Gate k/k PRs touching test/e2e or API****

-   [k/k API+Conformance Gate](https://github.com/cncf/apisnoop/projects/30)

### Background

Influenced by [Behaviour KEP user stories](https://github.com/kubernetes/enhancements/pull/1666/files?short_path=92a9412#diff-92a9412ae55358378bc66295cdbea103) while continuing to focus on endpoints!

> Will show increase in endpoints, and tested endpoints, but also, explicitly, whether conformance coverage increased.

> Comment: "you are adding a new endpoint to stable, and you are adding a conformance test for it"

### OKing PR

> Existing responsibility via owners file ensures that PRs touching swagger or conformance tests are ****/approved**** by right people.

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

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

-   Goal: 30
-   Stretch Goal: 40
-   Moving over 50% conformance would likeky increase complexity

### ****KR2 clean-up technical debt****

-   Goal: Clean technical debt back to 1.15
-   Stretch Goal: 6 of 18 Endpoints of 1.14

## ****Looking forward to a successful 1.20****
