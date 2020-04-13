
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

## complete cncf/apisnoop prow.k8s.io + Amazon migration (Score:0.5)

### KR1=0.5 All cncf/apisnoop artifacts created by prow.k8s.io

Definitions in prow, but need to do our Q1 release&#x2026; this week.

-   search for apisnoop in kubernetes/test-infra

    <https://github.com/kubernetes/test-infra/search?q=apisnoop&unscoped_q=apisnoop>

-   4 postsubmits that [run after merging code](https://github.com/kubernetes/test-infra/blob/master/prow/jobs.md#how-to-configure-new-jobs)

    We currently have four postsubmit jobs defined in [config/jobs/image-pushing/k8s-staging-apisnoop.yaml](https://github.com/kubernetes/test-infra/blob/c8eafffeadbd18617b071adb4dd3d7b900f06fa5/config/jobs/image-pushing/k8s-staging-apisnoop.yaml#L2)
    
    They are all variations of:
    
    ```yaml
    postsubmits:
      cncf/apisnoop:
        - name: apisnoop-push-webapp-images
          cluster: test-infra-trusted
          annotations:
            testgrid-dashboards: conformance-apisnoop
            testgrid-tab-name: apisnoop-webapp-image
            testgrid-alert-email: apisnoop@ii.coop
            description: Builds the webapp image for APISnoop deployments
          decorate: true
          branches:
            - ^master$
          spec:
            serviceAccountName: deployer # TODO(fejta): use pusher
            containers:
              - image: gcr.io/k8s-testimages/image-builder:v20200213-0032cdb
                command:
                  - /run.sh
                args:
                  # this is the project GCB will run in, which is the same as the GCR images are pushed to.
                  - --project=k8s-staging-apisnoop
                  - --scratch-bucket=gs://k8s-staging-apisnoop-gcb
                  - --env-passthrough=PULL_BASE_REF
                  - apps/webapp/app
    ```

-   testgrid dashboard group

    -   [test-infra/config/testgrids/conformance/conformance-all.yaml](https://github.com/kubernetes/test-infra/blob/98958caf0044dbe3c751c909eac861f0cbf5738f/config/testgrids/conformance/conformance-all.yaml#L5)
    
    ```yaml
    dashboard_groups:
    - name: conformance
      dashboard_names:
        - conformance-all
        - conformance-apisnoop
    ```

-   testgrid dashboards

    -   [test-infra/config/testgrids/conformance/conformance-all.yaml](https://github.com/kubernetes/test-infra/blob/98958caf0044dbe3c751c909eac861f0cbf5738f/config/testgrids/conformance/conformance-all.yaml#182)
    
    ```yaml
    dashboards:
    - name: conformance-all
      # entries are named $PROVIDER, $KUBERNETES_RELEASE
      dashboard_tab:
      - name: conformance-apisnoop
    ```

### KR2=0.0 All cncf/apisnoop github workflow managed by prow.k8s.io

-   [ ] PR Merged managed via prow (VS pushing to master or manual merging)

-   configure [test-infra/prow/config/plugins.yaml](https://github.com/kubernetes/test-infra/blob/2ac98631f533986f1d4b6cf8cb02d2f38f34f2b6/config/prow/plugins.yaml#L890-L905)

    -   [ ] Remove ability to push to branches
    -   [ ] enforce usage of PRs
    -   [ ] remove ability to merge
    -   [ ] add/enable owners files
    -   [ ] if tests don't pass, pr is blocked
    -   [ ] enforce lgtm + approve blocks
    -   [ ] k8s-bot merges the PRs

### KR3=1.0 All cncf/apisnoop non-prow infra moved to Amazon/Packet

We aren't hosting anything on Google (except via prow).

Everything is on EKS on Packet!

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

May realign to match the k8s release cycle. Our goal is to not make radical changes to process or approach, but iterate on our working methods to increase velocity and output in a stable, consistent way.

## Prepare to Gate cncf/k8s-conformance PRs

### KR1 Setup prow.cncf.io

This repo is outside kubernetes org.

We'll need to set this up in a sustainable/supportable way.

-   [ ] DNS prow.cncf.io pointing to prow.apisnoop.io
-   [ ] Grant cncf-ci bot permissions to cncf github org
-   [ ] Researching the isolation / clusters used by test-infra / k8s-infra-wg
-   [ ] Deploy clusters for prow.cncf.io
-   [ ] Deploy prow onto said clusters
-   [ ] Look into setting up #wg-cncf-infra if there is interest

### KR2 Connect cncf/k8s-conformance to prow.cncf.io

Comments and admin actions from prow.cncf.io

Will be made using the [cncf-ci](https://github.com/cncf-ci) bot/github account.

-   [ ] Enable meow and simple prow bot plugins

### KR3 gate+comment w/ list of unrun conformance tests

-   [ ] generate list of test run in a PR
-   [ ] generate list of tests required for PR version
-   [ ] comment with list of missing tests if under 20
-   [ ] comment with count of missing test if over 20
-   [ ] add hold tag if test lists don't match

-   definition

    Defined by the [user stories for KEP-960](https://github.com/kubernetes/enhancements/blob/2c19ec7627e326d1c75306dcaa3d2f14002301fa/keps/sig-architecture/960-conformance-behaviors/README.md#role-cncf-conformance-program)
    
        Must confirm that the version of the tests being run matches...
        Must confirm the set of tests being run matches...
        Must confirm that all behaviors are covered by a test...
    
    Will show increase in endpoints, and tested endpoints, but also, explicitly, whether conformance coverage increased. Be able to say "you are adding a new endpoint to stable, and you are adding a conformance test for it"
    
    We will investigate the method for ok'ing a pr, and who has the go-ahead to do this. Bot would likely manage the approval, but done through labels applied by people in owners file or some other set convention.

## Prepare to Gate k/k PRs touching test/e2e or API

Influenced by [Behavior KEP user stories](https://github.com/kubernetes/enhancements/pull/1666/files?short_path=92a9412#diff-92a9412ae55358378bc66295cdbea103)

while continuing to focus on endpoints.

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

-   [ ] alpha : comment endpoints needing tests
-   [ ] beta : comment endpoints needing tests
-   [ ] stable : comment and block via tag

### KR5 Manual Approval for SIG-Arch (or appropriate owners)

Ensure the API Review process has been followed.

-   [ ] Get feedback on approval process from SIG-Arch
-   [ ] Ensure the correct tagging / OWNERS are respected

### KR6 Donate APISnoop to sig-arch

-   [ ] Get feedback if this is desired
-   [ ] Get as to location of repo under k8s org
-   [ ] Migration maybe in Q3

## Increase Stable Test Coverage Velocity 50% over Q1

### KR1 (0/+40) new conformant stable endpoints

### KR2 +9% Coverage Increase

### KR3 (stretch) 50% stable endpoints hit by conformance tests
