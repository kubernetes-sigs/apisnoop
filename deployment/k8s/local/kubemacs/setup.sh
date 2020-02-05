# Deploy kind

if [ ! -z "$DEBUG" ]; then
    set -x
fi
export KUBEMACS_IMAGE="${KUBEMACS_IMAGE:-gcr.io/apisnoop/kubemacs:0.9.30}"
export KUSTOMIZE_PATH="${KUSTOMIZE_PATH:-https://github.com/cncf/apisnoop/deployment/k8s/local}"
export KIND_IMAGE="${KIND_IMAGE:- kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62}"
export DEFAULT_NS="${DEFAULT_NS:-ii}"

docker pull $KIND_IMAGE

if read -p "Press enter to destroy your current kind cluster, ^C to abort "; then
    kind delete cluster
fi
curl https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kind-cluster-config.yaml -o kind-cluster-config.yaml
kind create cluster --config kind-cluster-config.yaml --image $KIND_IMAGE

# Cache Kubemacs image

# ensure large images are cached
kubectl apply --dry-run -k "$KUSTOMIZE_PATH" -o yaml \
  | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq \
  | xargs -n 1 docker pull
kubectl apply --dry-run -k "$KUSTOMIZE_PATH" -o yaml \
  | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq \
  | xargs -n 1 kind load docker-image
docker pull $KUBEMACS_IMAGE # cache into docker socket
kind load docker-image --nodes kind-worker $KUBEMACS_IMAGE # docker->kind

# Deploy apisnoop services

kubectl create ns $DEFAULT_NS
kubectl config set-context $(kubectl config current-context) --namespace=$DEFAULT_NS

#kubectl apply -k https://github.com/cncf/apisnoop/deployment/k8s/xip.io/kubemacs
kubectl apply -k "$KUSTOMIZE_PATH/kubemacs"
echo "Waiting for Kubemacs StatefulSet to have 1 ready Replica..."
while [ "$(kubectl get statefulset kubemacs -o json | jq .status.readyReplicas)" != 1 ]; do
  sleep 1s
done
kubectl wait --for=condition=Ready pod/kubemacs-0
kubectl exec -t -i kubemacs-0 -- attach
