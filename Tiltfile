# -*- mode: python; -*-
# For use on aws
# allow_k8s_contexts('hh@ii.coop@exiting-mongoose-X.us-east-1.eksctl.io')
# settings = read_json('tilt_options.json, default={})
# default_registry(settings.get('default_registry','gcr.io/k8s-staging-apisnoop))
# For use in-cluster
default_registry('registry:5000',
                 host_from_cluster='registry:5000')
k8s_yaml(kustomize('kustomize'))
docker_build('raiinbow/webapp', 'apps/webapp/app')
docker_build('raiinbow/hasura', 'apps/hasura/app')
docker_build('raiinbow/auditlogger', 'apps/auditlogger/app')
docker_build('raiinbow/postgres', 'apps/postgres/app')
allow_k8s_contexts('in-cluster')
