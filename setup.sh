cd ~/cncf/apisnoop/

kind delete cluster --name kind
kind create cluster --name kind \
     --image kindest/node:v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62 \
     --config apisnoop/deployment/k8s/kind-cluster-config.yaml
kind load docker-image --nodes kind-worker gcr.io/apisnoop/kubemacs:0.9.23
kubectl apply -f apisnoop/deployment/k8s/kubemacs.yaml
kubectl apply -f apisnoop/deployment/k8s/kubemacs.yaml
