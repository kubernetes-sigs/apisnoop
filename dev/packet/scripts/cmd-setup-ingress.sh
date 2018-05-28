#!/bin/bash

if [[ "$1" == "up" ]]; then
	COMMAND="apply"
elif [[ "$1" == "down" ]]; then
	COMMAND="delete"
else
  echo "Usage: cmd-ingress up|down"
  exit
fi

# ingress-nginx
# Limitations
# External IP is not working on Packet
kubectl $COMMAND -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
kubectl $COMMAND -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/baremetal/service-nodeport.yaml



#kubectl $COMMAND -f rook/cluster/examples/kubernetes/wordpress.yaml
#kubectl $COMMAND -f rook/cluster/examples/kubernetes/mysql.yaml
kubectl get pods --all-namespaces
kubectl get services
