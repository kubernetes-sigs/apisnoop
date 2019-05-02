#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

run_tests() {
    # export the KUBECONFIG
    # KUBECONFIG="$(kind get kubeconfig-path)" << Issue: Reports the wrong path to the current kind cluster for some reason
    KUBECONFIG="/root/.kube/kind-config-kind-kubetest" # Solution: Use the current kind path for now
    export KUBECONFIG

    # base kubetest args
    KUBETEST_ARGS="--provider=skeleton --test --check-version-skew=false"

    # get the number of worker nodes
    # TODO(bentheelder): this is kinda gross
    NUM_NODES="$(kubectl get nodes \
        -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.taints}{"\n"}{end}' \
        | grep -cv "node-role.kubernetes.io/master" \
    )"

    # ginkgo regexes
    SKIP="${SKIP:-"Alpha|Kubectl|\\[(Disruptive|Feature:[^\\]]+|Flaky)\\]"}"
    FOCUS="${FOCUS:-"\\[Conformance\\]"}"
    # if we set PARALLEL=true, skip serial tests set --ginkgo-parallel
    PARALLEL="${PARALLEL:-false}"
    if [[ "${PARALLEL}" == "true" ]]; then
        SKIP="\\[Serial\\]|${SKIP}"
        KUBETEST_ARGS="${KUBETEST_ARGS} --ginkgo-parallel"
    fi

    # add ginkgo args
    KUBETEST_ARGS="${KUBETEST_ARGS} --test_args=\"--ginkgo.focus=${FOCUS} --ginkgo.skip=${SKIP} --report-dir=${ARTIFACTS} --disable-log-dump=true --num-nodes=${NUM_NODES}\""

    # setting this env prevents ginkg e2e from trying to run provider setup
    export KUBERNETES_CONFORMANCE_TEST="y"

    # run kubetest, if it fails clean up and exit failure
    eval "kubetest ${KUBETEST_ARGS}"
}

# Usage: SKIP="ginkgo skip regex" FOCUS="ginkgo focus regex" kind-e2e.sh << Issue: This file does not exist, update.

# Key settings from e2e.sh main()
ARTIFACTS="${ARTIFACTS:-${PWD}/_artifacts}"
mkdir -p "${ARTIFACTS}"
export ARTIFACTS

SKIP="ginkgo skip regex" FOCUS="ginkgo focus regex" run_tests