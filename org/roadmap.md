- [2020 Q1 (Jan-Mar)](#sec-1)
  - [Increase Stable Test Coverage Velocity 100% over 2019 (Score: 0.2)](#sec-1-1)
    - [KR1=0.3 (8/+27) new conformant stable endpoints](#sec-1-1-1)
    - [kr2=0.3 +6% coverage increase](#sec-1-1-2)
  - [complete cncf/apisnoop prow.k8s.io + EKS migration (Score: 0.5)](#sec-1-2)
    - [KR1=0.5 All cncf/apisnoop artifacts created by prow.k8s.io](#sec-1-2-1)
    - [KR2=0.0 All cncf/apisnoop github workflow managed by prow.k8s.io](#sec-1-2-2)
    - [KR3=1.0 All cncf/apisnoop non-prow infra moved to EKS/Packet](#sec-1-2-3)
  - [Mentor/Teach test-writing workflow at Contributer Summit / KubeConEU (Score: 0.5)](#sec-1-3)
    - [KR1=0.0 Caleb and Hippie Mentoring at Contributor Summit](#sec-1-3-1)
    - [KR2 1.0 Zach and Stephen teaching test writing](#sec-1-3-2)
- [2020 Q2 (Apr-Jun)](#sec-2)
  - [Increase Stable Test Coverage Velocity 50% over Q1](#sec-2-1)
    - [KR1 (0/+40) new conformant stable endpoints](#sec-2-1-1)
    - [KR2 +9% Coverage Increase](#sec-2-1-2)
    - [KR3 (stretch) 50% stable endpoints hit by conformance tests](#sec-2-1-3)
  - [Prepare to Gate k/k PRs touching test/e2e or API](#sec-2-2)
    - [KR1 comment w/ list of increase/decrease of stable endpoints](#sec-2-2-1)
    - [KR2 gate w/ comment](#sec-2-2-2)
  - [Prepare to Gate cncf/k8s-conformance PRs touching v\*.\*/](#sec-2-3)
    - [KR1 comment w/ list of unrun conformance tests](#sec-2-3-1)
    - [KR2 gate w/ comment](#sec-2-3-2)


# 2020 Q1 (Jan-Mar)<a id="sec-1"></a>

## Increase Stable Test Coverage Velocity 100% over 2019 (Score: 0.2)<a id="sec-1-1"></a>

### KR1=0.3 (8/+27) new conformant stable endpoints<a id="sec-1-1-1"></a>

1.  SCORE CALCULATION: 0.3 -> 1.0

    Done(8)
    
    -   Needs Approval(3) = 11 -> 0.4
    -   Needs Two Weeks(16) = 27 -> 1.0

2.  done = 8

    1.  done +3 promote: secret patching test #87262
    
    2.  done +1 promote: find kubernetes service in default namespace #87260
    
    3.  done +1 promote: namespace patch test #87256
    
    4.  done +3 promote: pod preemptionexecutionpath verification
    
        -   promotion: <https://github.com/kubernetes/kubernetes/pull/83378>

3.  needs approval +3

    1.  promotion +3 promote: podtemplate lifecycle test #88036 (removing flakes)
    
        -   issue: <https://github.com/kubernetes/kubernetes/issues/86141> needs reopening and checkboxes for current state..
        -   promotion: <https://github.com/kubernetes/kubernetes/pull/88036#ref-pullrequest-571656281>
        -   flakes: <https://github.com/kubernetes/kubernetes/pull/88588#issuecomment-606957802>
        -   addressing flakes: [https://github.com/kubernetes/kubernetes/pull/89746](https://github.com/kubernetes/kubernetes/pull/89746)

4.  needs two weeks (no flakes) +16

    1.  soak +5 promote: event lifecycle test
    
        -   mock-test: jan 6th <https://github.com/kubernetes/kubernetes/issues/86288>
        -   test: april 1st <https://github.com/kubernetes/kubernetes/pull/86858>
        -   promotion: <https://github.com/kubernetes/kubernetes/pull/89753>
        
        give the reviewer all the information all we need
        
        -   [testgrid reference](https://testgrid.k8s.io/sig-release-master-blocking#gce-cos-master-default&include-filter-by-regex=should%20ensure%20that%20an%20event%20can%20be%20fetched%2c%20patched%2c%20deleted%2c%20and%20listed)
    
    2.  soak +7 promote: replicationcontroller lifecycle
    
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/88302> needs reopening and checkboxes for current state&#x2026;
        -   test: <https://github.com/kubernetes/kubernetes/pull/88588>
        -   promotion:
        
        -   [address flaking comment](https://github.com/kubernetes/kubernetes/issues/89740) : [https://github.com/kubernetes/kubernetes/pull/89746](https://github.com/kubernetes/kubernetes/pull/89746)
        
        relies on it's own update response data > i have the same concern as #89707 that this test will not fail if the watch times out
    
    3.  soak +4 promote: endpoints
    
        -   mock-test: feb 3rd <https://github.com/kubernetes/kubernetes/issues/87762>
        -   test: mar 27th <https://github.com/kubernetes/kubernetes/pull/88778>
        -   promotion: april 10th? <https://github.com/kubernetes/kubernetes/pull/89752>
        -   [testgrid reference](https://testgrid.k8s.io/sig-release-master-blocking#gce-cos-master-default&include-filter-by-regex=should%20test%20the%20lifecycle%20of%20an%20endpoint) still looks green!
        
        fixme: create shows +5^, mock+promotion shows +4 same issue as configmap lificle: this doesn't verify that the endpoints is deleted. it just watches for an endpoints deletion event. would this test fail if it didn't see a deletion event?

5.  needs review +6

    1.  comments +2 promote: configmap lifecycle test #88034 (comments addressed)
    
        conceptually this pr adds watches there's no gaurantee that we will see the watch. let's ensure what happens in the negative case. when your waiting for the config map to be deleted, how do you know it's not deleted. for each watch: what happens if the watch times out&#x2026; when you setup a watch to timeout after 60 seconds&#x2026;. pretend it's running on a super slow processor what if it times out for every single test&#x2026;. would i want the watch to be considered a failure&#x2026;. probably&#x2026; if it doesn't execute to completion. it's not clear that that happens
        
        -   promotion: <https://github.com/kubernetes/kubernetes/pull/88034#discussion_r398728147>
        -   addressing comments: <https://github.com/kubernetes/kubernetes/pull/88034#issuecomment-607430447> (addresed)
        -   pr to handle timeouts: <https://github.com/kubernetes/kubernetes/pull/89707>
    
    2.  comments +4 pod and podstatus
    
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/88545>
        -   test: <https://github.com/kubernetes/kubernetes/pull/89453> addressed the [comment](https://github.com/kubernetes/kubernetes/pull/89453#discussion_r400346746): "not sure this will work, you will be racing with the kubelet, i think. that is, kubelet may mark it ready again."

6.  sorted backlog +5

    1.  backlog +2 servicestatus lifecycle
    
        -   org-file: <https://github.com/cncf/apisnoop/pull/298>
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/89135> currently, this test is having issues writing to the servicestatus endpoints (via patch and update). the data is patched without errors, but the data when fetched is no different to before the patching.
    
    2.  backlog +3 serviceaccount lifecycle
    
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/89071> @johnbelamaric you don't need to check the status of the secret as part of the test. in other places we check that the resource in question happens, we don't have to follow.

7.  triage +12

    1.  triage +5 apps daemonset lifecycle
    
        -   org-file: <https://github.com/cncf/apisnoop/pull/305>
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/89637>
    
    2.  triage +5 apps deployment lifecycle
    
        -   org-file:
        -   mock-test: <https://github.com/kubernetes/kubernetes/issues/89340>
    
    3.  triage +2 nodestatus     :deprioritized:
    
        needs these comments addressed, and we voted to de-priorize <https://github.com/kubernetes/kubernetes/issues/88358#issuecomment-591062171>

### kr2=0.3 +6% coverage increase<a id="sec-1-1-2"></a>

1.  score: 0.3

    based on the same kr above&#x2026; but depends on the two week soak.

## complete cncf/apisnoop prow.k8s.io + EKS migration (Score: 0.5)<a id="sec-1-2"></a>

### KR1=0.5 All cncf/apisnoop artifacts created by prow.k8s.io<a id="sec-1-2-1"></a>

Definitions in prow, but need to do our Q1 release&#x2026; this week.

### KR2=0.0 All cncf/apisnoop github workflow managed by prow.k8s.io<a id="sec-1-2-2"></a>

-   [ ] PR Merged managed via prow (VS pushing to master or manual merging)

### KR3=1.0 All cncf/apisnoop non-prow infra moved to EKS/Packet<a id="sec-1-2-3"></a>

Anything not on prow or EKS, not on Google.

## Mentor/Teach test-writing workflow at Contributer Summit / KubeConEU (Score: 0.5)<a id="sec-1-3"></a>

### KR1=0.0 Caleb and Hippie Mentoring at Contributor Summit<a id="sec-1-3-1"></a>

I am pairing weekly with Guin and Mallian to ensure the workflow is accessible, if they like it I'll bring it as a mentoring session for others soon. Caleb is mentoring Zach and Stephen.

### KR2 1.0 Zach and Stephen teaching test writing<a id="sec-1-3-2"></a>

They are teaching Riaan, all remote, using our org-flow.

# 2020 Q2 (Apr-Jun)<a id="sec-2"></a>

## Increase Stable Test Coverage Velocity 50% over Q1<a id="sec-2-1"></a>

### KR1 (0/+40) new conformant stable endpoints<a id="sec-2-1-1"></a>

### KR2 +9% Coverage Increase<a id="sec-2-1-2"></a>

### KR3 (stretch) 50% stable endpoints hit by conformance tests<a id="sec-2-1-3"></a>

## Prepare to Gate k/k PRs touching test/e2e or API<a id="sec-2-2"></a>

### KR1 comment w/ list of increase/decrease of stable endpoints<a id="sec-2-2-1"></a>

(maybe gate on behaviours)

### KR2 gate w/ comment<a id="sec-2-2-2"></a>

## Prepare to Gate cncf/k8s-conformance PRs touching v\*.\*/<a id="sec-2-3"></a>

### KR1 comment w/ list of unrun conformance tests<a id="sec-2-3-1"></a>

Dims has something helpful going forward. What is the version

### KR2 gate w/ comment<a id="sec-2-3-2"></a>
