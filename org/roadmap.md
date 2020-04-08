
# 2020 Q1 (Jan-Mar)

## Increase Stable Test Coverage Velocity 100% over 2019 (Score:0.4)

We have the remaining 16 endpoints already soaking in the two weeks no flakes window.

We are confident they will merge shortly.

### KR1=0.4 (11/+27) new conformant stable endpoints

-   SCORE CALCULATION: 0.4 -> 1.0

    Done(11)
    
    -   Needs Two Weeks(16) = 27 -> 1.0

### kr2=0.4 +6% coverage increase

-   SCORE CALCULATION: 0.4 -> 1.0

    This number should increase to the full 6% in ~2 weeks.

## complete cncf/apisnoop prow.k8s.io + EKS migration (Score:0.5)

### KR1=0.5 All cncf/apisnoop artifacts created by prow.k8s.io

Definitions in prow, but need to do our Q1 release&#x2026; this week.

### KR2=0.0 All cncf/apisnoop github workflow managed by prow.k8s.io

-   [ ] PR Merged managed via prow (VS pushing to master or manual merging)

### KR3=1.0 All cncf/apisnoop non-prow infra moved to EKS/Packet

We aren't hosting anything on Google (except via prow). Everything is on EKS on Packet!

## Mentor/Teach test-writing workflow at Contributer Summit / KubeConEU (Score:0.5)

### KR1=0.0 Caleb and Hippie Mentoring at Contributor Summit

I am pairing weekly with with k8s community members.

To ensure the workflow is accessible.

Caleb is mentoring Zach and Stephen.

### KR2 1.0 Zach and Stephen teaching test writing

They in turn are teaching Riaan

all remote

using our org-flow

# 2020 Q2 (Apr-Jun)

May realign to match the k8s release cycle.

## Prepare to Gate cncf/k8s-conformance PRs

### KR1 gate+comment w/ list of unrun conformance tests

Dims has something helpful going forward. We've run the process Aaron as well.

## Prepare to Gate k/k PRs touching test/e2e or API

Influenced by [Behavior KEP user stories](https://github.com/kubernetes/enhancements/pull/1666/files?short_path=92a9412#diff-92a9412ae55358378bc66295cdbea103)

while continuing to focus on endpoints.

-   We should donate APISnoop to sig-arch

### KR1 gate+comment w/ list of increase/decrease of stable endpoints

-   Analyze all PRs
-   (initially /area-conformance + /sig-arch)
-   Only comment on PRs that touch swagger.json or tests/e2e

COMMENT: alpha beta

BLOCK: stable

## Increase Stable Test Coverage Velocity 50% over Q1

### KR1 (0/+40) new conformant stable endpoints

### KR2 +9% Coverage Increase

### KR3 (stretch) 50% stable endpoints hit by conformance tests
