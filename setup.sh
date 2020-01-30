# TODO Create a K8s cluster Running Kubemacs

# [[file:~/cncf/apisnoop/deployment/k8s/kind-cluster-config.yaml::#%20kind-cluster-config.yaml][kind-cluster-config.yaml (enabling Dynamic Audit Logging)]]


wget https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kind-cluster-config.yaml
kind create cluster --name kind \
     --image kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62 \
     --config kind-cluster-config.yaml
# these two commands just ensure our image is cached and available quickly
docker pull gcr.io/apisnoop/kubemacs:0.9.23
kind load docker-image --nodes kind-worker gcr.io/apisnoop/kubemacs:0.9.23
kubectl create namespace kubemacs
kubectl apply -f https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kubemacs.yaml
# Careful as this will restart the dev/code writing pod
kubectl -n kubemacs set env deployment/kubemacs \
        GIT_COMMITTER_EMAIL=hh@ii.coop \
        GIT_COMMITTER_NAME="Hippie Hacker" \
        GIT_AUTHOR_EMAIL=hh@ii.coop \
        GIT_AUTHOR_NAME="Hippie Hacker"

PODNAME=$(kubectl -n kubemacs get pod --selector=app=kubemacs -o name  | sed s:pod/::)
kubectl describe -n kubemacs pod/$PODNAME
kubectl get -n kubemacs pod/$PODNAME
