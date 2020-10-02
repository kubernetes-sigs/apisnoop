#!/usr/bin/env bash
set -x

# Deploy APISnoop in kind

kind create cluster --config kind+apisnoop.yaml

# install gateway

cat <<EOF | glooctl install gateway --values -
gatewayProxies:
  gatewayProxy:
    service:
      type: NodePort
      httpPort: 31500
      httpsPort: 32500
      httpNodePort: 31500
      httpsNodePort: 32500
EOF

# deploy petstore

kubectl apply -f https://raw.githubusercontent.com/solo-io/gloo/v1.2.9/example/petstore/petstore.yaml

kubectl label namespace default  discovery.solo.io/function_discovery=enabled

# Ensure gateway-proxy Deployment is Available


kubectl wait --for=condition=Available --selector=gloo=gateway-proxy -n gloo-system deployment

# Add route


glooctl add route \
  --path-exact /all-pets \
  --dest-name default-petstore-8080 \
  --prefix-rewrite /api/pets

# ensure default virutalservice is Accepted

set +x
echo -n Waiting for default virtual service to be Accepted...
while [ $(glooctl get virtualservice  default -o json | jq -r '.[0].status.state') != "Accepted" ] ; do echo -n . ; sleep 1 ; done
echo !
glooctl get virtualservice  default
echo -n Waiting for upstream default-petstore-8080 to be Accepted...
while [ $(glooctl get upstream default-petstore-8080 -o json | jq -r '.[0].status.state') != "Accepted" ] ; do echo -n . ; sleep 1 ; done
glooctl get upstream default-petstore-8080
set -x

# Connect to route

curl $(glooctl proxy url)/all-pets
