
# v1.20

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Looking back at 1.19

### OKR Scoring

-   ****Gate cncf/k8s-conformance PR's****
    -   Result: 0.9 (Final Switchover Pending)
-   ****Gate k/k of PR's touching test/e2e or API****
    -   Result: 0.4 (Major Direction Change)
-   ****Increase Stable Test Coverage****
    -   Result: 1.0 (Best Ever)

### ****Gate cncf/k8s-conformance PR's****

-   ****KR1**** Setup prow.cncf.io
-   ****KR2**** Connect cncf/k8s-conformance to prow.cncf.io
-   ****KR3**** gate+comment
-   The Conformance gate is implemented and tested on [cncf-infra/k8s-conformance](https://github.com/cncf-infra/k8s-conformance/).
-   CNCF Approval needed to point at [cncf/k8s-conformance](https://github.com/cncf/k8s-conformance/).

### ****Final Switchover for cncf/K8s-conformance gate****

-   [Update Docs](https://github.com/cncf/k8s-conformance/pull/1070) to only allow single submissions
-   Set implementation date / switch over

### ****Gate k/k of PR's touching test/e2e or API****

-   ****KRs**** Will be updated for 1.20
-   Feedback from #sig-testing / #sig-contribex
    -   Discouraged: ****PR Blocking Presubmits****
    -   Prefered: ****Release Blocking Periodic****
-   We are soliciting feedback from SIG Testing on the technical details

### ****Increase Stable Test Coverage by 40 endpoints****

-   ****KR1**** (39/40) new conformant stable endpoints
-   ****KR2**** (17.54% / +9%) Coverage Increase
-   ****KR3**** (stretch 56.4%) +50% stable endpoints hit by conformance tests

## ****Achievements not in OKRs for 1.19****

### Preventing further technical debt

-   Two Endpoints Beta->GA sans Conformance
-   Picked-up by APISnoop
-   Conformance Tests added

### APISnoop improvements

-   Conformance-Coverage Graphs
-   New Release Endpoints beneath sunburst
-   Standalone SnoopDB
    -   (openAPI spec + conformance coverage)

## Looking forward to 1.20

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

-   Goal: 30
-   Stretch Goal: 40
-   Remaining 50% conformance seems of increased complexity

### ****KR2 clean-up technical debt****

-   Goal: Clean technical debt back to 1.15
-   Stretch Goal: 6 of 18 Endpoints of 1.14

## ****Release Blocking k/k Jobs touching test/e2e or API****

This will likely change quite a bit as we move to Release Blocking Job instead of PR blocking Job.

### ****KR1: Identify list of endpoints added/removed****

-   Tooling will compare path/operation id in api/openapi-spec/swagger.json
    -   Generate list of new endpoints
    -   Generate list of removed endpoints
-   Run APISnoop against PR to generate endpoint coverage review

### ****KR2: Tooling will provide a list of tested and conformant endpoints.****

-   Wait for main prow job to finish
-   Generate list of hit/tested endpoints
-   Generate list of conformant endpoints
-   Bot comment with list of increase/decrease of endpoints

### ****KR3: Tooling will comment directly on PR + Link to APISnoop landing page****

-   ****Alpha & Beta:**** List endpoints needing tests. Note: Endpoints can not be promoted to GA without Conformance test.
-   ****Stable:**** comment via tag. (List endpoints needing tests. Note: Endpoints can not be promoted to GA without Conformance test.)

### ****APISnoop landing page****

Explain conformance testing is a requirement for Endpoints to be promoted to GA

-   List documents:
    -   Conformance Test Requirements
    -   Promoting Tests to Conformance
    -   Writing good e2e tests for Kubernetes
    -   Introduction to APISnoop tool + links
    -   Explanation & Access to different release data
    -   Link to Conformance Office Hours Meeting Notes

## ****Looking forward to a successful 1.20****
