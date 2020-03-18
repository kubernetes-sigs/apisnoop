# Deploy kind

#!/bin/bash -e
if [ ! -z "$DEBUG" ]; then
    set -x
fi
export KUSTOMIZE_PATH="${KUSTOMIZE_PATH:-https://github.com/cncf/apisnoop/deployment/k8s/xip.io}"
export KIND_IMAGE="${KIND_IMAGE:- kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62}"
export DEFAULT_NS="${DEFAULT_NS:-ii}"

# Cache Kubemacs image

# ensure large images are cached
kubectl apply --dry-run -k "$KUSTOMIZE_PATH" -o yaml | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq | xargs -n 1 docker pull
kubectl apply --dry-run -k "$KUSTOMIZE_PATH" -o yaml | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq | xargs -n 1 kind load docker-image

# Deploy apisnoop services

kubectl create ns $DEFAULT_NS
kubectl config set-context $(kubectl config current-context) --namespace=$DEFAULT_NS

#kubectl apply -k https://github.com/cncf/apisnoop/deployment/k8s/xip.io/kubemacs
kubectl apply -k "$KUSTOMIZE_PATH"
