- [Before we begin](#sec-1)
  - [namespaces](#sec-1-1)
  - [get services](#sec-1-2)
  - [kubemacs within the ii namespace](#sec-1-3)
  - [kubemacs statefulset](#sec-1-4)
  - [simple-init.sh](#sec-1-5)
  - [attach](#sec-1-6)
  - [tmate](#sec-1-7)
- [Bring up tilt](#sec-2)
- [These files/folders map to these \*.localho.st sites on 127.0.0.1](#sec-3)
  - [<http://tilt.kubemacs.org>](#sec-3-1)
  - [[deployment/k8s/hasura](file:///home/ii/apisnoop/deployment/k8s/hasura) -> [apps/hasura](../../../apps/hasura) -> <http://hasura.kubemacs.org>](#sec-3-2)
  - [[deployment/k8s/webapp](file:///home/ii/apisnoop/deployment/k8s/webapp) -> [apps/webapp](../../../apps/webapp) -> <http://apisnoop.kubemacs.org/coverage>](#sec-3-3)
  - [[deployment/k8s/pgadmin](../pgadmin) -> <http://pgadmin.kubemacs.org>](#sec-3-4)
    - [test sql connections](#sec-3-4-1)
    - [permissions need to be super strict](#sec-3-4-2)
  - [[deployment/k8s/postgres](file:///home/ii/apisnoop/deployment/k8s/postgres) -> [apps/postgres](../../../apps/postgres)](#sec-3-5)
- [Visit these sites](#sec-4)


# Before we begin<a id="sec-1"></a>

## namespaces<a id="sec-1-1"></a>

```shell
kubectl get ns
```

    NAME                 STATUS   AGE
    default              Active   45m
    ii                   Active   42m
    kube-node-lease      Active   45m
    kube-public          Active   45m
    kube-system          Active   45m
    local-path-storage   Active   45m

## get services<a id="sec-1-2"></a>

```shell
kubectl get services
```

    NAME            TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
    kubemacs-tilt   ClusterIP   10.96.185.30   <none>        10350/TCP   54m

## kubemacs within the ii namespace<a id="sec-1-3"></a>

```shell
kubectl get clusterrolebinding kubemacs-crb -o yaml
```

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"rbac.authorization.k8s.io/v1","kind":"ClusterRoleBinding","metadata":{"annotations":{},"name":"kubemacs-crb"},"roleRef":{"apiGroup":"rbac.authorization.k8s.io","kind":"ClusterRole","name":"cluster-admin"},"subjects":[{"kind":"ServiceAccount","name":"kubemacs-sa","namespace":"ii"}]}
  creationTimestamp: "2020-02-05T22:00:37Z"
  name: kubemacs-crb
  resourceVersion: "1075"
  selfLink: /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/kubemacs-crb
  uid: 280cbcc1-0970-48cc-a1c1-9bc4c1a70910
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubemacs-sa
  namespace: ii
```

```shell
kubectl get all -n ii
```

While `service/kubemacs-tilt` service may exist, the kubemacs container is not yet running tilt.

    NAMESPACE            NAME                                             READY   STATUS    RESTARTS   AGE
    ii                   pod/kubemacs-0                                   1/1     Running   0          42m
    kube-system          pod/coredns-6955765f44-gfn55                     1/1     Running   0          46m
    kube-system          pod/coredns-6955765f44-sjb79                     1/1     Running   0          46m
    kube-system          pod/etcd-kind-control-plane                      1/1     Running   0          46m
    kube-system          pod/kindnet-9tflf                                1/1     Running   0          45m
    kube-system          pod/kindnet-tt5tk                                1/1     Running   0          46m
    kube-system          pod/kube-apiserver-kind-control-plane            1/1     Running   0          46m
    kube-system          pod/kube-controller-manager-kind-control-plane   1/1     Running   0          46m
    kube-system          pod/kube-proxy-gks55                             1/1     Running   0          46m
    kube-system          pod/kube-proxy-w5pgp                             1/1     Running   0          45m
    kube-system          pod/kube-scheduler-kind-control-plane            1/1     Running   0          46m
    local-path-storage   pod/local-path-provisioner-7745554f7f-zkzqp      1/1     Running   0          46m
    
    NAMESPACE     NAME                    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                  AGE
    default       service/kubernetes      ClusterIP   10.96.0.1      <none>        443/TCP                  46m
    ii            service/kubemacs-tilt   ClusterIP   10.96.185.30   <none>        10350/TCP                42m
    kube-system   service/kube-dns        ClusterIP   10.96.0.10     <none>        53/UDP,53/TCP,9153/TCP   46m
    
    NAMESPACE     NAME                        DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
    kube-system   daemonset.apps/kindnet      2         2         2       2            2           <none>                        46m
    kube-system   daemonset.apps/kube-proxy   2         2         2       2            2           beta.kubernetes.io/os=linux   46m
    
    NAMESPACE            NAME                                     READY   UP-TO-DATE   AVAILABLE   AGE
    kube-system          deployment.apps/coredns                  2/2     2            2           46m
    local-path-storage   deployment.apps/local-path-provisioner   1/1     1            1           46m
    
    NAMESPACE            NAME                                                DESIRED   CURRENT   READY   AGE
    kube-system          replicaset.apps/coredns-6955765f44                  2         2         2       46m
    local-path-storage   replicaset.apps/local-path-provisioner-7745554f7f   1         1         1       46m
    
    NAMESPACE   NAME                        READY   AGE
    ii          statefulset.apps/kubemacs   1/1     42m

## kubemacs statefulset<a id="sec-1-4"></a>

```shell
kubectl describe statefulset/kubemacs
```

Note that we set `GIT_*`, `INIT_*` env vars to influence how git and kubemacs loads. We also use hostpath to mount `/tmp` `/workspace` and `/var/run/docker.sock` from outside kind, into our kubemacs container. Mounting `/tmp` allows us to set **SSH<sub>AUTH</sub><sub>SOCK</sub>** to allow `ssh-agent` and `ssh -A`

    Name:               kubemacs
    Namespace:          ii
    CreationTimestamp:  Thu, 06 Feb 2020 11:00:37 +1300
    Selector:           app=kubemacs
    Labels:             <none>
    Annotations:        kubectl.kubernetes.io/last-applied-configuration:
                          {"apiVersion":"apps/v1","kind":"StatefulSet","metadata":{"annotations":{},"name":"kubemacs","namespace":"ii"},"spec":{"replicas":1,"select...
    Replicas:           1 desired | 1 total
    Update Strategy:    RollingUpdate
      Partition:        824644665128
    Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed
    Pod Template:
      Labels:           app=kubemacs
      Service Account:  kubemacs-sa
      Containers:
       kubemacs:
        Image:      gcr.io/apisnoop/kubemacs:0.9.32
        Port:       <none>
        Host Port:  <none>
        Command:
          /usr/local/bin/simple-init.sh
          $INIT_ORG_FILE
        Environment:
          TZ:                   <set to the key 'TZ' of config map 'kubemacs-configuration'>                 Optional: false
          GIT_COMMITTER_EMAIL:  <set to the key 'GIT_EMAIL' of config map 'kubemacs-configuration'>          Optional: false
          GIT_COMMITTER_NAME:   <set to the key 'GIT_NAME' of config map 'kubemacs-configuration'>           Optional: false
          GIT_AUTHOR_EMAIL:     <set to the key 'GIT_EMAIL' of config map 'kubemacs-configuration'>          Optional: false
          GIT_AUTHOR_NAME:      <set to the key 'GIT_NAME' of config map 'kubemacs-configuration'>           Optional: false
          INIT_DEFAULT_REPO:    <set to the key 'INIT_DEFAULT_REPO' of config map 'kubemacs-configuration'>  Optional: false
          INIT_DEFAULT_DIR:     <set to the key 'INIT_DEFAULT_DIR' of config map 'kubemacs-configuration'>   Optional: false
          INIT_ORG_FILE:        <set to the key 'INIT_ORG_FILE' of config map 'kubemacs-configuration'>      Optional: false
        Mounts:
          /home/ii/workspace from kubemacs-hostpath (rw)
          /tmp from host-tmp (rw)
          /var/run/docker.sock from docker (rw)
      Volumes:
       kubemacs-hostpath:
        Type:          HostPath (bare host directory volume)
        Path:          /workspace
        HostPathType:  
       docker:
        Type:          HostPath (bare host directory volume)
        Path:          /var/run/docker.sock
        HostPathType:  Socket
       host-tmp:
        Type:          HostPath (bare host directory volume)
        Path:          /var/host/tmp
        HostPathType:  
    Volume Claims:     <none>
    Events:
      Type    Reason            Age   From                    Message
      ----    ------            ----  ----                    -------
      Normal  SuccessfulCreate  45m   statefulset-controller  create Pod kubemacs-0 in StatefulSet kubemacs successful

## simple-init.sh<a id="sec-1-5"></a>

This is the command, and the arument is what file/folder. <file:///usr/local/bin/simple-init.sh> This defaults to `INIT_ORG_FILE` in the configmap applied to the statefulset.

## attach<a id="sec-1-6"></a>

This is the command, and the arument is what file/folder. <file:///usr/local/bin/attach> We use attach to connect to spawned tmate sessions via **kubectl exec -ti kubemacs-0 attach SESSION**

## tmate<a id="sec-1-7"></a>

tmate config currently uses the hosted, but we CAN run this in cluster&#x2026; later.

```shell
ps ax | grep tmate
```

      93 ?        S      0:03 tmate -F -v -S /tmp/ii.default.target.iisocket new-session -d -c /home/ii/apisnoop/deployment/k8s/kubemacs.org emacsclient --tty /home/ii/apisnoop/deployment/k8s/kubemacs.org/ncw.org
     142 pts/0    S+     0:00 tmate -S /tmp/ii.default.target.iisocket at
    1529 ?        S      0:00 grep tmate

# Bring up tilt<a id="sec-2"></a>

```tmate
tilt up --host 0.0.0.0
```

```tmate
x
```

If you attempt to do **docker build** and get permissions problems&#x2026; just

```shell
id
```

    uid=2000(ii) gid=2000(ii) groups=2000(ii),27(sudo),100(users),107(docker)

```shell
ls -la /var/run/docker.sock
```

    srw-rw---- 1 root users 0 Feb  6 10:52 /var/run/docker.sock

```tmate
sudo chgrp users /var/run/docker.sock
```

# These files/folders map to these \*.localho.st sites on 127.0.0.1<a id="sec-3"></a>

These will ask for a password. It is stored in the `basic-auth` secrets. You can set what it is by running this code:

```shell
LOGIN=hh
PASSWORD=ii 
kubectl delete secret basic-auth
kubectl create secret generic basic-auth \
--from-literal=auth=$(echo $PASSWORD | htpasswd -i -n $LOGIN)
```

    secret "basic-auth" deleted
    secret/basic-auth created

## <http://tilt.kubemacs.org><a id="sec-3-1"></a>

Our [./Tiltfile](Tiltfile) uses the [./kustomization.yaml](kustomization.yaml) to figure out what resources to deploy. Changes to any file referenced will result in immediate changes to the deployed resources. If [docker<sub>build</sub>()](Tiltfile) entries are uncommented, those images will be rebuilt, pushed, and pods restarted automatically.

## [deployment/k8s/hasura](file:///home/ii/apisnoop/deployment/k8s/hasura) -> [apps/hasura](../../../apps/hasura) -> <http://hasura.kubemacs.org><a id="sec-3-2"></a>

[org/tables<sub>and</sub><sub>views</sub><sub>bot.org</sub>](file:///home/ii/apisnoop/org/tables_and_views_bot.md) can be tangled and primarily updates hasura, but can also be run interactively

## [deployment/k8s/webapp](file:///home/ii/apisnoop/deployment/k8s/webapp) -> [apps/webapp](../../../apps/webapp) -> <http://apisnoop.kubemacs.org/coverage><a id="sec-3-3"></a>

[org/webapp.org](file:///home/ii/apisnoop/org/webapp.md) can be tangled and primarily updates

## [deployment/k8s/pgadmin](../pgadmin) -> <http://pgadmin.kubemacs.org><a id="sec-3-4"></a>

### test sql connections<a id="sec-3-4-1"></a>

```shell
echo foo
```

```sql-mode
\conninfo
```

```sql-mode
select 1;
```

```example
 ?column? 
----------
        1
(1 row)

```

### permissions need to be super strict<a id="sec-3-4-2"></a>

So we use a set of [initContainers](file:///home/ii/apisnoop/deployment/k8s/pgadmin/deployment.yaml) to copy [servers.json](file:///home/ii/apisnoop/deployment/k8s/pgadmin/configuration.yaml) and [pgpass](file:///home/ii/apisnoop/deployment/k8s/pgadmin/configuration.yaml) out of a mounted configMap volume and set user/group/perms.

## [deployment/k8s/postgres](file:///home/ii/apisnoop/deployment/k8s/postgres) -> [apps/postgres](../../../apps/postgres)<a id="sec-3-5"></a>

# Visit these sites<a id="sec-4"></a>

-   <http://tilt.kubemacs.org>
-   <http://pgadmin.kubemacs.org>
-   <http://hasura.kubemacs.org>
-   <http://apisnoop.kubemacs.org>
