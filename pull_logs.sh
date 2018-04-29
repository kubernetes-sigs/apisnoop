#!/bin/bash
gcloud compute ssh k8s-apisnoop-2ba342b1-master-qjl9 --command \
  "sudo docker exec \$(sudo docker ps -a | grep kube-apiserver-amd64 | awk '{print \$1}') tail -f /var/log/kubernetes/audit/audit.log"
