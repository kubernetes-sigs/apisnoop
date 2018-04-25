#!/bin/sh
set -e
set -x
minikube start --v=4  --mount --mount-string=$PWD:/tmp/files \
         --feature-gates=AdvancedAuditing=true
echo
echo "Running this should update kube-apiserver.yaml and trigger a restart:"
echo ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
    -i $(minikube ssh-key) docker@$(minikube ip) \
    sudo /tmp/files/apiserver-config-v2.patch.sh
echo
echo "Running this sets up a test server to receive events from the webhook:"
echo "go run test-server.go"
