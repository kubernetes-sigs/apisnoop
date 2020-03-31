# Footnotes

# Run with EMAIL=me@my.net NAME="First Last" bash local-setup.sh
NAME=${NAME:-"Hippie Hacker"}
EMAIL=${EMAIL:-"hh@ii.coop"}
KIND_IMAGE="kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62"
KIND_CONFIG="kind-cluster.yaml"
K8S_RESOURCES="k8s-resources.yaml"
DEFAULT_NS="ii"
cat <<EOF > kind-cluster.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
kubeadmConfigPatches:
- |
  apiVersion: kubeadm.k8s.io/v1beta2
  kind: ClusterConfiguration
  metadata:
    name: config
  apiServer:
    extraArgs:
      "feature-gates": "DynamicAuditing=true"
      "runtime-config": "auditregistration.k8s.io/v1alpha1=true"
      "audit-dynamic-configuration": "true"
nodes:
 - role: control-plane
   extraMounts:
   - containerPath: /var/run/docker.sock
     hostPath: /var/run/docker.sock
     readOnly: False
   - containerPath: /var/host/tmp
     hostPath: /tmp
     readOnly: False
   extraPortMappings:
   - containerPort: 80
     hostPort: 80
   - containerPort: 443
     hostPort: 443
   kubeadmConfigPatches:
   - |
     apiVersion: kubeadm.k8s.io/v1beta2
     kind: InitConfiguration
     nodeRegistration:
       kubeletExtraArgs:
         node-labels: "ingress-ready=true"
         authorization-mode: "AlwaysAllow"
 - role: worker
   extraMounts:
   - containerPath: /var/run/docker.sock
     hostPath: /var/run/docker.sock
     readOnly: False
   - containerPath: /var/host/tmp
     hostPath: /tmp
     readOnly: False
EOF
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
kubectl wait --for=condition=Ready pod/kubemacs-0
kubectl exec -ti kubemacs-0 -- attach
