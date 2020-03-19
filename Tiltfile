# -*- mode: python; -*-
k8s_yaml(kustomize('kustomize'))
docker_build('gcr.io/k8s-staging-apisnoop/webapp', 'apps/webapp/app',
  live_update=[
  fall_back_on(['package.json', 'package-lock.json']),
  sync('apps/webapp/app','/src')
  ])
docker_build('gcr.io/k8s-staging-apisnoop/hasura', 'apps/hasura/app')
# docker_build('gcr.io/k8s-staging-apisnoop/auditlogger', 'apps/auditlogger/app')
docker_build('gcr.io/k8s-staging-apisnoop/postgres', 'apps/postgres')
allow_k8s_contexts('in-cluster')
