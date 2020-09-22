
# v1.19

## Objective results

-   ****Gate cncf/k8s-conformance PR's****
    -   Result: 0.9
-   ****Gate k/k of PR's touching test/e2e or API****
    -   Result: 0.4
-   ****Increase Stable Test Coverage****
    -   Result: 1.0

## ****Gate cncf/k8s-conformance PR's****

-   ****KR1**** Setup prow.cncf.io
-   ****KR2**** Connect cncf/k8s-conformance to prow.cncf.io
-   ****KR3**** gate+comment
-   The Conformance gate is implemented and tested on [cncf-infra/k8s-conformance](https://github.com/cncf-infra/k8s-conformance/).
-   It is ready to be pointed at [cncf/k8s-conformance](https://github.com/cncf/k8s-conformance/).

## ****Gate k/k of PR's touching test/e2e or API****

-   The high level overview was agreed in the SIG Architecture office hours meeting
-   There was no objections from the community
-   We are soliciting feedback from SIG Testing on the technical details

## ****Increase Stable Test Coverage by 40 endpoints****

## ****KR1 (39/40) new conformant stable endpoints****

-   Community introduced 41 New endpoints to GA
-   40 Endpoint was introduced with tests
-   ii introduced Conformance tests for 38 old endpoints
-   ii added a Conformance test to 1 new endpoints promoted without a test

## ****KR2 (17.54% / +9%) Coverage Increase****

****38.86%->56.4%****

-   Target have been exceeded with ii and the community's effort
-   Percentage would not be used as a measure from 1.20
-   Percentage many not be a clear indicator due to:
    -   New endpoints, deprecation and ineligible endpoints etc.

## ****KR3 (stretch 56.4%) +50% stable endpoints hit by conformance tests****

-   Achieved by the team work of ii and the community

## ****Achievements not in OKRs for 1.19****

## Preventing further technical debt

-   Two Endpoints graduated from Beta to GA sans Conformance
-   Both endpoints was picked-up by APISnoop and Conformance tests where add in 1.19
-   We allowed no new technical debt

## APISnoop improvements in 1.19

-   New endpoints for each release beneath sunburst
-   Progress graph toggle between percentage and numbers
-   SnoopDB (openAPI spec + conformance coverage)
-   Coverage data taken from e2e test suite runs
-   Used for CI / coverage updates
-   Used for research and issue creation
