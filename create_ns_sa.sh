#!/bin/bash
# create our ns and sa
KAPP=$1
kubectl create ns $KAPP
kubectl create serviceaccount $KAPP --namespace $KAPP
# RBAC setup
cat <<-EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: $KAPP
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: $KAPP
  namespace: $KAPP
EOF

# cat <<-EOF | kubectl apply -f -

# apiVersion: rbac.authorization.k8s.io/v1beta1
# kind: ClusterRoleBinding
# metadata:
#   labels:
#     component: apisnoop-$KAPP
#   name: apisnoop-$KAPP
# roleRef:
#   apiGroup: rbac.authorization.k8s.io
#   kind: ClusterRole
#   name: apisnoop-$KAPP
# subjects:
# - kind: ServiceAccount
#   name: apisnoop-$KAPP
#   namespace: apisnoop-$KAPP
# ---
# apiVersion: rbac.authorization.k8s.io/v1beta1
# kind: ClusterRole
# metadata:
#   labels:
#     component: apisnoop-$KAPP
#   name: apisnoop-$KAPP
#   namespace: apisnoop-$KAPP
# rules:
# - apiGroups:
#   - '*'
#   resources:
#   - '*'
#   verbs:
#   - '*'
# EOF
#
# gather current token + current config
TOKEN=$(kubectl -n $KAPP get secret $(
    kubectl -n $KAPP get secret | grep $KAPP | awk '{print $1}'
        ) -o=jsonpath='{.data.token}' | base64 -d)
CURRENT_CONTEXT=$(kubectl config current-context)
CURRENT_CLUSTER=$(kubectl config get-contexts $CURRENT_CONTEXT | tail -1 | awk '{print $3}')

# use new credentials / context
kubectl config set-credentials $KAPP --token $TOKEN
kubectl config set-context $KAPP --namespace $KAPP --user $KAPP --cluster $CURRENT_CLUSTER
kubectl config use-context $KAPP

# CURRENT_USER=$(kubectl config get-contexts $CURRENT_CONTEXT | tail -1 | awk '{print $4}')
# --user $CURRENT_USER
