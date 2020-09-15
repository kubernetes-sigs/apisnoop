
# v1.20

Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Update for 1.20

## ****Increase Stable Test Coverage****

### ****KR1 increase new conformant stable endpoints****

-   Goal: 30 - Stretch Goal: 40
-   Current Status:
    -   Test write:
        -   PR of 7 Endpoint form the "Proxy" group
        -   3 PR's for 17 Endpoints with intermittend flakes being reviewed

### ****KR2 clean-up technical debt****

-   Goal: Clean technical debt back to 1.15 [Technical Debt](https://apisnoop.cncf.io/conformance-progress?relchart=number) has been cleared with the last inligible endpoints identified
-   Stretch Goal: 6 of 18 Endpoints of 1.14

## ****Release Blocking k/k Jobs touching test/e2e or API****

Moved to Release Blocking Job instead of PR blocking Job by community agreement.

### ****Progress****

-   The job within [k/test-infra#19173](https://github.com/kubernetes/test-infra/pull/19173) is runnig on [prow.cncf.io](https://prow.cncf.io/)
-   Caught new untested endpoint
-   SIG Network responed with [k/test-infra/#19160](https://github.com/kubernetes/test-infra/issues/19160)
    -   to take responsibility for the Conformance of their API's
    -   APISnoop also seem to gain more traction in the community in this way

### ****APISnoop landing page****

Updates made:

-   Improved color to better contrast the work done
-   Graph Legend improved
-   About page information improved with more documentation links
-   List documents:
    -   Conformance Testing in Kubernetes
    -   Writing good e2e tests for Kubernetes
    -   Link to Conformance Office Hours Meeting Notes

## ****Other Important News****

### ****Timeline****

-   1.20 [Timeline](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.20#timeline) is avalible
    -   As expected, it will be a short cycle
    -   Code freeze 12 November 2020
    -   Release date 8 December 2020

### ****Conformance Gate****

-   CNCF Conformance gate is running
    -   Next steps must be discussed

### ****KubeCon + CloudNativeCon North America 2020 Virtual****

-   ii Recieved an invitation to speak at the Maintainer Track Sessions
    -   The Conference take place November 17–20
    -   ii will present a 35 minute slot on our work to improve conformance and the tooling we developed

## ****Questions / Feedback****
