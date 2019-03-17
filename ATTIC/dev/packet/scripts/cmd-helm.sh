#!/bin/bash +e
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
dist=`uname -s | tr "[A-Z]" "[a-z]"`
version="v2.6.0"
arch="amd64"

install() {
    #Download and unpack helm
    wget https://storage.googleapis.com/kubernetes-helm/helm-${version}-${dist}-${arch}.tar.gz
    tar -zxvf helm-${version}-${dist}-${arch}.tar.gz
    sudo mv ${dist}-${arch}/helm /usr/local/bin/helm
    rm -rf ${dist}-${arch}/
    rm helm-${version}-${dist}-${arch}.tar.gz*

    #Init helm
    helm init

    sleep 5

    helm_ready=$(kubectl get pods -l app=helm -n kube-system -o jsonpath='{.items[0].status.phase}')
    INC=0
    until [[ "${helm_ready}" == "Running" || $INC -gt 20 ]]; do
        echo "."
        sleep 10
        ((++INC))
        helm_ready=$(kubectl get pods -l app=helm -n kube-system -o jsonpath='{.items[0].status.phase}')
    done

    if [ "${helm_ready}" != "Running" ]; then
        echo "Helm init not successfully"
        exit 1
    fi

    echo "Helm init successful"


    # set up RBAC for helm
    kubectl -n kube-system create sa tiller
    kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
    kubectl -n kube-system patch deploy/tiller-deploy -p '{"spec": {"template": {"spec": {"serviceAccountName": "tiller"}}}}'

}

helm_reset() {
    helm reset
    sudo rm /usr/local/bin/helm
}


case "${1:-}" in
  up)
    install
    ;;
  down)
    helm_reset
    ;;
  *)
    echo "usage:" >&2
    echo "  $0 up" >&2
    echo "  $0 down" >&2
esac
