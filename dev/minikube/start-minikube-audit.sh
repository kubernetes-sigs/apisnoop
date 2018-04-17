#!/bin/sh
set -e
set -x
minikube start --v=4  --mount --mount-string=$PWD:/tmp/files \
         --feature-gates=AdvancedAuditing=true \
         --extra-config=apiserver.audit-policy-file==/tmp/files/audit-policy.yaml \
         --extra-config=apiserver.audit-log-path=/tmp/files/audit.log
         #2>&1 | tee /tmp/minikube.log
#sleep 15
echo "Running this should update kube-apiserver.yaml and trigger a restart:"
echo ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no \
    -i $(minikube ssh-key) docker@$(minikube ip) \
    sudo /tmp/files/apiserver-config.patch.sh
