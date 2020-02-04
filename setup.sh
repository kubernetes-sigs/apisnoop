# TODO Create a K8s cluster Running Kubemacs
   
# [[file:~/cncf/apisnoop/deployment/k8s/kind-cluster-config.yaml::#%20kind-cluster-config.yaml][kind-cluster-config.yaml (enabling Dynamic Audit Logging)]]


export NS=ii
export KUBEMACS_IMAGE=gcr.io/apisnoop/kubemacs:0.9.24
# ensure current kind-cluster-config.yaml
wget -c https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kind-cluster-config.yaml
kind create cluster --name kind \
     --image kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62 \
     --config kind-cluster-config.yaml
# Populate the kind work node CRIs with the larger images before deployment
docker pull $KUBEMACS_IMAGE # cache into docker socket
kind load docker-image --nodes kind-worker $KUBEMACS_IMAGE # docker->kind
# create a namespace / set default NS
kubectl create ns $NS
kubectl config set-context $(kubectl config current-context) --namespace=$NS
# these two commands just ensure our image is cached and available quickly
kubectl apply -k https://github.com/cncf/apisnoop/deployment/k8s/local
kubectl wait --for=condition=Available deployment/kubemacs
KUBEMACS_POD=$(kubectl get pod --selector=app=kubemacs -o name  | sed s:pod/::)
kubectl exec -ti $KUBEMACS_POD -- tmate -S /tmp/ii.default.target.iisocket wait tmate-ready
kubectl exec -ti $KUBEMACS_POD -- attach
