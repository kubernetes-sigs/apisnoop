# apisnoop_v3

An apisnoop built for querying your cluster from multiple angles using a shared language.  

## Setting it up

APISnoop is intended to be run in a kubernetes cluster with auditing enabled.

We've included an example config that would setup an APISnoop compatible cluster.


```shell
curl https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/kind-cluster-config.yaml -o kind-cluster-config.yaml
kind create cluster --name kind-$USER --config kind-cluster-config.yaml
```

Once up, apply APISnoop using our provided yaml 

```shell
kubectl apply -f "https://raw.githubusercontent.com/cncf/apisnoop/master/deployment/k8s/raiinbow.yaml"
```

APISnoop is built around a set of postgres tables and views, with dta you can explore through queries.

If you want to explore the data using a graphql interface, you can port-forward our hasura frontend:
```shell
export GOOGLE_APPLICATION_CREDENTIALS=$PATH_TO_YOUR_CREDENTIALS
HASURA_POD=$(kubectl get pod --selector=io.apisnoop.graphql=hasura -o name | sed s:pod/::)
HASURA_PORT=$(kubectl get pod $HASURA_POD --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}')
kubectl port-forward $HASURA_POD --address 0.0.0.0 8080:$HASURA_PORT
```
If you want to explore using direct sql queries, you can port-forward our postgres instance and query using psql:
```shell
export GOOGLE_APPLICATION_CREDENTIALS=$PATH_TO_YOUR_CREDENTIALS
export K8S_NAMESPACE="kube-system"
kubectl config set-context $(kubectl config current-context) --namespace=$K8S_NAMESPACE 2>&1 > /dev/null
POSTGRES_POD=$(kubectl get pod --selector=io.apisnoop.db=postgres -o name | sed s:pod/::)
POSTGRES_PORT=$(kubectl get pod $POSTGRES_POD --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}')
kubectl port-forward $POSTGRES_POD $(id -u)1:$POSTGRES_PORT
```

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

## Walk-thru for Test Writing

---

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/cncf/apisnoop&tutorial=org/google-cloudshell/README.md)

---
