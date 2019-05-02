# Add setting from e2e.sh main()


ARTIFACTS="${ARTIFACTS:-${PWD}/_artifacts}"
mkdir -p "${ARTIFACTS}"
export ARTIFACTS

# Add Environment variables  


export KUBECONFIG="/root/.kube/kind-config-kind-kubetest"
export SKIP="ginkgo skip regex"
export FOCUS="ginkgo focus regex"

# Setup and export function ~run_tests~


run_tests() {
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
export -f run_tests

# Move to k8s folder and start a new subshell


cd $GOPATH/src/k8s.io/kubernetes
bash
