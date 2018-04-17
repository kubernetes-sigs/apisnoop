#!/bin/sh
minikube start --v=4  --mount --mount-string=$PWD:/tmp/files \
         --feature-gates=AdvancedAuditing=true \
         --extra-config=apiserver.audit-log-path=/tmp/files/audit.log
         #2>&1 | tee /tmp/minikube.log

ssh -i $(minikube ssh-key) docker@$(minikube ip) sudo /tmp/files/apiserver-config.patch.sh
