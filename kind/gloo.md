- [Gloo](#sec-1)
  - [Deploy APISnoop in kind](#sec-1-1)
  - [install gloo](#sec-1-2)
  - [install gateway](#sec-1-3)
  - [wait for gloo deployment to be Available](#sec-1-4)
  - [deploy petstore](#sec-1-5)
  - [wait for petstore deployment to be Available](#sec-1-6)
  - [Add route](#sec-1-7)
  - [ensure default virutalservice is Accepted](#sec-1-8)
  - [Connect to route](#sec-1-9)
- [SQL Research](#sec-2)
  - [clients](#sec-2-1)
  - [endpoints](#sec-2-2)
  - [psql](#sec-2-3)
  - [untested](#sec-2-4)


# Gloo<a id="sec-1"></a>

```tmate
#!/usr/bin/env bash
set -x
```

## Deploy APISnoop in kind<a id="sec-1-1"></a>

```tmate
kind create cluster --config kind+apisnoop.yaml
# ensure auditlogger is ready to apisnoop on k8s
kubectl wait --for=condition=Ready --selector=app.kubernetes.io/name=auditlogger --timeout=600s pod
export PGUSER=apisnoop
export PGHOST=localhost
```

## install gloo<a id="sec-1-2"></a>

```tmate
brew install solo-io/tap/glooctl
```

```shell
glooctl version
```

## install gateway<a id="sec-1-3"></a>

```shell
cat <<EOF | glooctl install gateway --values -
gatewayProxies:
  gatewayProxy:
    service:
      type: NodePort
      httpPort: 31500
      httpsPort: 32500
      httpNodePort: 31500
      httpsNodePort: 32500
EOF
```

## wait for gloo deployment to be Available<a id="sec-1-4"></a>

```shell
kubectl wait deployment -n gloo-system --for=condition=Available --selector=gloo=gateway
kubectl wait deployment -n gloo-system --for=condition=Available --selector=gloo=gateway-proxy
kubectl wait deployment -n gloo-system --for=condition=Available --selector=gloo=discovery
kubectl wait deployment -n gloo-system --for=condition=Available --selector=gloo=gloo
```

## deploy petstore<a id="sec-1-5"></a>

```shell
kubectl apply -f https://raw.githubusercontent.com/solo-io/gloo/v1.2.9/example/petstore/petstore.yaml
```

```shell
kubectl get svc petstore
```

```shell
glooctl get upstreams
```

```shell
glooctl get upstream default-petstore-8080 --output kube-yaml
```

```shell
kubectl label namespace default  discovery.solo.io/function_discovery=enabled  --overwrite
```

```shell
glooctl get upstream default-petstore-8080
```

```shell
glooctl get upstream default-petstore-8080 --output kube-yaml
```

## wait for petstore deployment to be Available<a id="sec-1-6"></a>

```shell
kubectl wait deployment --for=condition=Available --selector=app=petstore
```

## Add route<a id="sec-1-7"></a>

```shell
glooctl add route \
  --path-exact /all-pets \
  --dest-name default-petstore-8080 \
  --prefix-rewrite /api/pets
```

## ensure default virutalservice is Accepted<a id="sec-1-8"></a>

```shell
set +x
echo -n Waiting for default virtual service to be Accepted...
while [ $(glooctl get virtualservice  default -o json | jq -r '.[0].status.state') != "Accepted" ] ; do echo -n . ; sleep 1 ; done
echo !
glooctl get virtualservice  default
echo -n Waiting for upstream default-petstore-8080 to be Accepted...
while [ $(glooctl get upstream default-petstore-8080 -o json | jq -r '.[0].status.state') != "Accepted" ] ; do echo -n . ; sleep 1 ; done
echo !
glooctl get upstream default-petstore-8080
set -x
```

```shell
glooctl get virtualservice default --output kube-yaml
```

```shell
glooctl proxy url
```

## Connect to route<a id="sec-1-9"></a>

```shell
curl $(glooctl proxy url)/all-pets
```

# SQL Research<a id="sec-2"></a>

## clients<a id="sec-2-1"></a>

```sql-mode
select useragent
  from testing.audit_event
 where useragent like 'gloo%'
 group by useragent;
```

## endpoints<a id="sec-2-2"></a>

```sql-mode
select endpoint
  from testing.audit_event
 where useragent like 'gloo%'
 group by endpoint;
```

## psql<a id="sec-2-3"></a>

```shell
psql -U apisnoop -h localhost -c "select useragent from testing.audit_event where useragent like 'gloo%' group by useragent;"
psql -U apisnoop -h localhost -c "select useragent, endpoint, tested, conf_tested
  from        testing.audit_event
         join endpoint_coverage ec using(endpoint)
 where useragent like 'gloo%'
   and ec.release = '1.20.0'
   and conf_tested = false
 group by endpoint, ec.release, tested, conf_tested, useragent
 order by conf_tested asc;"
```

## untested<a id="sec-2-4"></a>

```sql-mode
select * from describe_columns('public','endpoint_coverage');
```

```sql-mode
select useragent, endpoint, tested, conf_tested
  from        testing.audit_event
         join endpoint_coverage ec using(endpoint)
 where useragent like 'gloo%'
   and ec.release = '1.20.0'
   and conf_tested = false
 group by endpoint, ec.release, tested, conf_tested, useragent
 order by conf_tested asc;
```
