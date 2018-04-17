#!/bin/sh
PATCH_SCRIPT=$(readlink -f "$0")
PATCH_DIR=$(dirname "$PATCH_SCRIPT")
set -x ; set -e

# patching in place seems to cause issues with minikube
cp /etc/kubernetes/manifests/kube-apiserver.yaml /tmp
cd /tmp
patch < $PATCH_DIR/apiserver-config.patch

# copying a new files into place restart kube-apiserver
cp /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/
