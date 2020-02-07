
# Creating a apisnoop.localho.st test writing cluster

You can either copy and paste these into a local terminal or download or try the following:

```shell
wget https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/local/kubemacs/localho.st-setup.sh
export EMAIL=hh@ii.coop
export NAME="Hippie Hacker"
# or edit local-setup.sh before running
# if needed, you will want a clean cluster
# kind delete cluster
set -x
. localho.st-setup.sh
```

Our APISnoop Development Cluster

-   requires DynamicAuditLogging
-   hostPorts 80/443 so we can reach the in-cluster services via \*.localho.st
-   host /var/run/docker.socket for tilt - building images to push into the cluster
-   host /tmp (for ssh-agent + sockets) for git push to ssh urls

# kind-cluster.yaml

```yaml
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
```

# Steps

## Configuration Vars

```shell
NAME=${NAME:-"Hippie Hacker"}
EMAIL=${EMAIL:-"hh@ii.coop"}
KIND_IMAGE="kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62"
KIND_CONFIG="kind-cluster.yaml"
K8S_RESOURCES="k8s-resources.yaml"
DEFAULT_NS="ii"
```

## kustomization.yaml

```yaml
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
```

## Create and kind cluster

```shell
kind create cluster --config $KIND_CONFIG --image $KIND_IMAGE
```

## cache/load images

```shell
kubectl kustomize . > $K8S_RESOURCES # uses kustomization.yaml
K8S_IMAGES=$(cat $K8S_RESOURCES | grep image: | sed 's/.*:\ \(.*\)/\1/' | sort | uniq )
echo $K8S_IMAGES | xargs -n 1 docker pull # cache images in docker
echo $K8S_IMAGES | xargs -n 1 kind load docker-image --nodes kind-worker # load cache into kind-worker
```

## Deploy kubemacs

```shell
kubectl create ns $DEFAULT_NS
kubectl config set-context $(kubectl config current-context) --namespace=$DEFAULT_NS
kubectl apply -f $K8S_RESOURCES
echo "Waiting for Kubemacs StatefulSet to have 1 ready Replica..."
while [ "$(kubectl get statefulset kubemacs -o json | jq .status.readyReplicas)" != 1 ]; do
  sleep 1s
done
kubectl wait --for=condition=Ready pod/kubemacs-0
```

## Attach to kubemacs

This command will attach using tmate, and will populate your system clipboard (over OSC52) a tmate ssh/url to share with a test writing mentor/mentee.

```shell
kubectl wait --for=condition=Ready pod/kubemacs-0
kubectl exec -ti kubemacs-0 -- attach
```
