- [Docker run cloud-native k8s dev env](#sec-1)
  - [Environment for docker-init](#sec-1-1)
  - [Running Docker](#sec-1-2)
- [Optionally Update Ingress](#sec-2)
  - [local computer only](#sec-2-1)
  - [Update YOUPIP.xip.io](#sec-2-2)
  - [Optionally Update \*.local.ii.coop -> \*.YOU.your.domain](#sec-2-3)
- [Bring up tilt](#sec-3)
- [Reset basic-auth password](#sec-4)
- [Next steps](#sec-5)


# Docker run cloud-native k8s dev env<a id="sec-1"></a>

## Environment for docker-init<a id="sec-1-1"></a>

Customize with your own email and repos (usually forks) to check out.

```shell
# Pin your image
# KUBEMACS_IMAGE=kubemacs/kubemacs:2020.02.19
# Or not
# KUBEMACS_IMAGE=kubemacs/kubemacs:latest
KUBEMACS_IMAGE=kubemacs/kubemacs:2020.02.19
# $(id -u) / mainly for ~/.kube/config permissions
HOST_UID="1001"
# Vars for git commits
KUBEMACS_GIT_EMAIL=hh@ii.coop
KUBEMACS_GIT_NAME="Hippie Hacker"
KUBEMACS_TIMEZONE=Pacific/Auckland
# This is the kind cluster name, maybe we should rename
# for some reason we can't used kind as the name
KUBEMACS_KIND_NAME=cncf.conformance
# ~/.kube/$KUBEMACS_HOSTCONFIG_NAME
KUBEMACS_HOST_KUBECONFIG_NAME=config
# Using a docker registry alongside kind
KIND_LOCAL_REGISTRY_ENABLE=true
KIND_LOCAL_REGISTRY_NAME=local-registry
KIND_LOCAL_REGISTRY_PORT=5000
# The repositories to check out
KUBEMACS_INIT_DEFAULT_REPOS='https://github.com/cncf/apisnoop.git'
# The folder to start tmate/emacs in
KUBEMACS_INIT_DEFAULT_DIR=apisnoop
# The first file you want emacs to open
KUBEMACS_INIT_ORG_FILE=apisnoop/test-writing.org
# If you want to see lots of information
KUBEMACS_INIT_DEBUG=true
```

## Running Docker<a id="sec-1-2"></a>

```shell
ENV_FILE=test-writing.env
. $ENV_FILE
docker run \
       --env-file $ENV_FILE \
       --name kubemacs-docker-init \
       --user root \
       --privileged \
       --network host \
       --rm \
       -it \
       -v "$HOME/.kube:/tmp/.kube" \
       -v /var/run/docker.sock:/var/run/docker.sock \
       $KUBEMACS_IMAGE \
       docker-init.sh
```

# Optionally Update Ingress<a id="sec-2"></a>

You can use the default urls that use the following catchall domains, but they will only work on your local computer. They work by responding with the address 127.0.0.1 for any (\*) hostname within that domain.

If you want to share with others, you'll need a working DNS domain pointing to your IP, which work simlarly, but resolve to your public (or local wifi/ethernet) ip. Use YOUIP.xip.io if you don't have a domain, or configure your own.

## local computer only<a id="sec-2-1"></a>

-   \*.localho.st
    -   <http://tilt.localho.st>
    -   <http://pgadmin.localho.st>
    -   <http://hasura.localho.st>
    -   <http://apisnoop.localho.st>
-   \*.127.0.0.1.xip.io # can be updated to your own IP
    -   <http://tilt.127.0.0.1.xip.io>
    -   <http://pgadmin.127.0.0.1.xip.io>
    -   <http://hasura.127.0.0.1.xip.io>
    -   <http://apisnoop.127.0.0.1.xip.io>
-   \*.local.ii.coop # can be updated to your own domain
    -   <http://tilt.local.ii.coop>
    -   <http://pgadmin.local.ii.coop>
    -   <http://hasura.local.ii.coop>
    -   <http://apisnoop.local.ii.coop>

## Update YOUPIP.xip.io<a id="sec-2-2"></a>

```shell
CURRENT_IP=127.0.0.1 # the default
NEW_IP=$(curl ifconfig.co) # or IP of choice
sed -i s:$CURRENT_IP:$NEW_IP:g kustomize/*yaml
echo http://tilt.$NEW_IP.xip.io
echo http://pgadmin.$NEW_IP.xip.io
echo http://hasura.$NEW_IP.xip.io
echo http://apisnoop.$NEW_IP.xip.io
```

    http://tilt.127.0.0.1.xip.io
    http://pgadmin.127.0.0.1.xip.io
    http://hasura.127.0.0.1.xip.io
    http://apisnoop.127.0.0.1.xip.io

## Optionally Update \*.local.ii.coop -> \*.YOU.your.domain<a id="sec-2-3"></a>

```shell
CURRENT_DOMAIN=local.ii.coop
NEW_DOMAIN=hh.ii.coop
sed -i s:$CURRENT_DOMAIN:$NEW_DOMAIN:g kustomize/*yaml
echo http://tilt.$NEW_DOMAIN
echo http://pgadmin.$NEW_DOMAIN
echo http://hasura.$NEW_DOMAIN
echo http://apisnoop.$NEW_DOMAIN
```

    http://tilt.local.ii.coop
    http://pgadmin.local.ii.coop
    http://hasura.local.ii.coop
    http://apisnoop.local.ii.coop

# Bring up tilt<a id="sec-3"></a>

Tilt will use the kustomization.yaml and the patches it references to bring up the apisnoop development environment.

```tmate
tilt up --host 0.0.0.0
```

# Reset basic-auth password<a id="sec-4"></a>

The default basic-auth user: ii pass: ii. To change it, just update the basic-auth secret.

```shell
kubectl delete secret basic-auth
kubectl create secret generic basic-auth \
  --from-literal=auth=$(
    LOGIN=hh
    PASSWORD=ii
    echo $PASSWORD | htpasswd -i -n $LOGIN)
```

    secret "basic-auth" deleted
    secret/basic-auth created

# Next steps<a id="sec-5"></a>

If your writing tests, your next step are likely:

-   [Check it all worked](./org/tickets/mock-template.md)
-   [Check current coverage](./org/tickets/mock-template.md)
-   [Identify an untested feature Using APISnoop](./org/tickets/mock-template.md)
