# apisnoop_v3

An apisnoop built for querying your cluster from multiple angles using a shared language.  

## Setting it up

APISnoop is intended to be run in a kubernetes cluster with auditing enabled.

We've included an example config that would setup an APISnoop compatible cluster.


```shell
curl https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kind-cluster-config.yaml -o kind-cluster-config.yaml
kind create cluster --config kind-cluster-config.yaml
```

Once up, apply APISnoop using our provided yaml 

```shell

# ensure large images are cached
export KUBEMACS_IMAGE=gcr.io/apisnoop/kubemacs:0.9.24
docker pull $KUBEMACS_IMAGE # cache into docker socket
kind load docker-image --nodes kind-worker $KUBEMACS_IMAGE # docker->kind

# create a namespace / set default NS
DEFAULTNS=ii
kubectl create ns $DEFAULTNS
kubectl config set-context $(kubectl config current-context) --namespace=$DEFAULTNS

kubectl apply -k https://github.com/cncf/apisnoop/deployment/k8s/local
kubectl wait --for=condition=Available deployment/kubemacs
KUBEMACS_POD=$(kubectl get pod --selector=app=kubemacs -o name  | sed s:pod/::)
kubectl exec -t -i $KUBEMACS_POD -- attach
```

APISnoop is built around a set of postgres tables and views, with dta you can explore through queries.

## Loading audit event logs
Apisnoop operates with a notion of a 'baseline' set of audit events and coverage information, and 'live' audit events triggered by the commands and functions you run against the cluster.  As you write and query tests, you'll be able to see how your work compares against this baseline.

By default, the baseline comes from the latest successful test run from `ci-kubernetes-e2e-gci-gce`.  However, you can configure a different bucket and/or job as needed.  These are set as env variables in the postgres portion of our provided deployment yaml.  

```yaml
env:
# - name: APISNOOP_BASELINE_BUCKET
#   value: ci-kubernetes-e2e-gce-cos-k8sbeta-default
# - name: APISNOOP_BASELINE_JOB
#   value: 1141312231231223
```

Simply uncomment and configure this portion in [the raiinbow.yaml](deployment/k8s/raiinbow.yaml).  Then, when building a cluster, apply apisnoop from this local file.
