cat <<EOF > kind-cluster.yaml

EOF

# Steps


NAME=${NAME:-"Hippie Hacker"}
EMAIL=${EMAIL:-"hh@ii.coop"}
KIND_IMAGE="kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62"
KIND_CONFIG="kind-cluster.yaml"
K8S_RESOURCES="k8s-resources.yaml"
DEFAULT_NS="ii"
cat <<EOF > kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
  - https://github.com/cncf/apisnoop/deployment/k8s/local/kubemacs
configMapGenerator:
- name: kubemacs-configuration
  behavior: merge
  literals:
  - TZ=Pacific/Auckland
  - GIT_NAME=${NAME}
  - GIT_EMAIL=${EMAIL}
  - INIT_DEFAULT_REPO=https://github.com/cncf/apisnoop.git
  - INIT_DEFAULT_DIR=/home/ii/apisnoop/deployment/k8s/local/
  - INIT_ORG_FILE=/home/ii/apisnoop/deployment/k8s/local/tilt.org
EOF
kind create cluster --config $KIND_CONFIG --image $KIND_IMAGE
kubectl kustomize . > $K8S_RESOURCES # uses kustomization.yaml
K8S_IMAGES=$(cat $K8S_RESOURCES | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq )
echo $K8S_IMAGES | xargs -n 1 docker pull # cache images in docker
echo $K8S_IMAGES | xargs -n 1 kind load docker-image --nodes kind-worker # load cache into kind-worker
kubectl create ns $DEFAULT_NS
kubectl config set-context $(kubectl config current-context) --namespace=$DEFAULT_NS
kubectl apply -f $K8S_RESOURCES
echo "Waiting for Kubemacs StatefulSet to have 1 ready Replica..."
while [ "$(kubectl get statefulset kubemacs -o json | jq .status.readyReplicas)" != 1 ]; do
  sleep 1s
done
kubectl wait --for=condition=Ready pod/kubemacs-0
echo Run the following in iTerm2, xterm, or other OSC52 Terminal:
echo kubectl exec -ti kubemacs-0 -- attach
