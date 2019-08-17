# apisnoop_v3

An apisnoop built for querying from multiple angles using a shared language.

## Setting it up

To get to our graphql explorer first clone this repo:

```shell
# If you have ssh keys setup with yr gitlab account
git clone git@github.com:cncf/apisnoop.git
cd apisnoop
git checkout v3_rainbow
```

from within the repo, start up our src/index.js file

```shell
cd app/hasura
# TODO combine DB into docker-compose / create k8s yaml
docker-compose up
```
