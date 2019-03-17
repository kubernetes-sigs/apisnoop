#!/bin/bash

if [[ "$1" == "up" ]]; then
	COMMAND="apply"
elif [[ "$1" == "down" ]]; then
	COMMAND="delete"
else
  echo "Usage: rookie up|down"
  exit
fi


cat <<EOF | kubectl $COMMAND -f -
# privilegedPSP grants access to use the privileged PSP.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: privileged-psp-user
rules:
- apiGroups:
  - extensions
  resources:
  - podsecuritypolicies
  resourceNames:
  - privileged
  verbs:
  - use
---
apiVersion: v1
kind: Namespace
metadata:
  name: rook-system
---
# Allow the rook-agent serviceAccount to use the privileged PSP
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: rook-agent-psp
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: privileged-psp-user
subjects:
- kind: ServiceAccount
  name: rook-agent
  namespace: rook-system
---
apiVersion: v1
kind: Namespace
metadata:
  name: rook
---
# Allow the default serviceAccount to use the priviliged PSP
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: rook-default-psp
  namespace: rook
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: privileged-psp-user
subjects:
- kind: ServiceAccount
  name: default
  namespace: rook
---
# Allow the rook-ceph-osd serviceAccount to use the privileged PSP
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: rook-ceph-osd-psp
  namespace: rook
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: privileged-psp-user
subjects:
- kind: ServiceAccount
  name: rook-ceph-osd
  namespace: rook
EOF

kubectl $COMMAND -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/rook-operator.yaml

cat <<EOF | kubectl $COMMAND -f -
apiVersion: rook.io/v1alpha1
kind: Cluster
metadata:
  name: my-rook
  namespace: rook
spec:
  dataDirHostPath: /var/lib/rook
  storage:
    useAllNodes: true
    useAllDevices: false
    metadataDevice:
    deviceFilter: sd[c-z]
    store: bluestore
    storeConfig:
      storeType: bluestore
      databaseSizeMB: 1024
      journalSizeMB: 1024
    directories:
    - path: /var/lib/rook-storage
EOF

cat <<EOF | kubectl $COMMAND -f -
apiVersion: rook.io/v1alpha1
kind: Pool
metadata:
  name: replicapool
  namespace: rook
spec:
  replicated:
    size: 3
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
   name: rook-block
   annotations:
      storageclass.kubernetes.io/is-default-class: true
provisioner: rook.io/block
parameters:
  pool: replicapool
  clusterNamespace: rook
  fstype: ext4
EOF

#if [[ "$COMMAND" == "apply" ]]; then
#  git clone https://github.com/rook/rook.git ~/rook
#fi



#kubectl $COMMAND -f rook/cluster/examples/kubernetes/wordpress.yaml
#kubectl $COMMAND -f rook/cluster/examples/kubernetes/mysql.yaml
kubectl get pods --all-namespaces
kubectl get pvc
