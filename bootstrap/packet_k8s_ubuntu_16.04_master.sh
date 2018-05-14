# ------------------------------------------------------------------------------------------------------------------------
# We are explicitly not using a templating language to inject the values as to encourage the user to limit their
# use of templating logic in these files. By design all injected values should be able to be set at runtime,
# and the shell script real work. If you need conditional logic, write it in bash or make another shell script.
# ------------------------------------------------------------------------------------------------------------------------

# Specify the Kubernetes version to use.
KUBERNETES_VERSION="1.10.2"
KUBERNETES_CNI="0.6.0"
FEATURE_GATES="AllAlpha=true,RotateKubeletServerCertificate=false,RotateKubeletClientCertificate=false,ExperimentalCriticalPodAnnotation=true,AdvancedAuditing=true"
POD_NETWORK="10.244.0.0/16"

# order is important:
# 1. update
# 2. install apt-transport-https
# 3. add kubernetes repos to list
# 4. update again
# 5. install
apt-get update -y
apt-get install -y apt-transport-https

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
touch /etc/apt/sources.list.d/kubernetes.list
sh -c 'echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list'

apt-get update -y

apt-get install -y \
    socat \
    ebtables \
    docker.io \
    apt-transport-https \
    kubelet=${KUBERNETES_VERSION}-00 \
    kubeadm=${KUBERNETES_VERSION}-00 \
    kubernetes-cni=${KUBERNETES_CNI}-00 \
    cloud-utils \
    jq


systemctl enable docker
systemctl start docker

# must disable swap for kubelet to work
swapoff -a

PUBLICIP=$(curl --silent  https://metadata.packet.net/metadata | jq '.network.addresses[] | select(.address_family == 4 and .public == true) .address')
PRIVATEIP=$(curl --silent  https://metadata.packet.net/metadata | jq '.network.addresses[] | select(.address_family == 4 and .public == false) .address')
TOKEN=$(cat /etc/kubicorn/cluster.json | jq -r '.clusterAPI.spec.providerConfig' | jq -r '.values.itemMap.INJECTEDTOKEN')
PORT=$(cat /etc/kubicorn/cluster.json | jq -r '.clusterAPI.spec.providerConfig' | jq -r '.kubernetesAPI.port | tonumber')

cat <<EOF > /etc/kubernetes/kubeadm.conf
apiVersion: kubeadm.k8s.io/v1alpha1
kind: MasterConfiguration
kubernetesVersion: v${KUBERNETES_VERSION}
token: ${TOKEN}
networking:
  podSubnet: ${POD_NETWORK}
authorizationModes:
- Node
- RBAC
apiServerCertSANs:
- ${PUBLICIP}
- ${PRIVATEIP}
featureGates:
  Auditing: true
controllerManagerExtraArgs:
  cluster-name: ii
  allocate-node-cidrs: "true"
  cidr-allocator-type: "RangeAllocator"
  cluster-cidr: ${POD_NETWORK}
  feature-gates: ${FEATURE_GATES}
schedulerExtraArgs:
  feature-gates: ${FEATURE_GATES}
apiServerExtraArgs:
  bind-port: ${PORT}
  advertise-address: ${PUBLICIP}
  feature-gates: ${FEATURE_GATES}
auditPolicy:
  path: "/etc/kubernetes/audit-policy.yaml"
  logDir: "/var/log/audit"
  logMaxAge: 10
EOF
chmod 0600 /etc/kubernetes/kubeadm.conf

cat <<EOPOLICY > /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1beta1
kind: Policy
omitStages:
  - "RequestReceived"
rules:
- level: RequestResponse
  resources:
  - group: "" # core
    resources: ["pods", "secrets"]
  - group: "extensions"
    resources: ["deployments"]
EOPOLICY
chmod 0600 /etc/kubernetes/audit-policy.yaml

kubeadm reset
kubeadm init --config /etc/kubernetes/kubeadm.conf

# Thanks Kelsey :)
kubectl apply \
  -f http://docs.projectcalico.org/v2.3/getting-started/kubernetes/installation/hosted/kubeadm/1.6/calico.yaml \
  --kubeconfig /etc/kubernetes/admin.conf

mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
