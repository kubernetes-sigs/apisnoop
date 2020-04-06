# -*- mode: python; -*-
# For use on aws
# allow_k8s_contexts('hh@ii.coop@exiting-mongoose-X.us-east-1.eksctl.io')
allow_k8s_contexts('hh@ii.coop@apisnoop-prod.ap-southeast-2.eksctl.io')
# settings = read_json('tilt_options.json, default={})
# default_registry(settings.get('default_registry','gcr.io/k8s-staging-apisnoop))
# For use in-cluster
# default_registry('registry:5000',
#                  host_from_cluster='registry:5000')
default_registry('928655657136.dkr.ecr.ap-southeast-2.amazonaws.com')
k8s_yaml(kustomize('kustomize'))
docker_build('gcr.io/k8s-staging-apisnoop/webapp', 'apps/webapp/app',
             live_update=[
                 sync('apps/webapp/src','/webapp/src')
             ])
docker_build('gcr.io/k8s-staging-apisnoop/hasura', 'apps/hasura/app')
# docker_build('gcr.io/k8s-staging-apisnoop/auditlogger', 'apps/auditlogger/app')
docker_build('gcr.io/k8s-staging-apisnoop/postgres', 'apps/postgres')
allow_k8s_contexts('in-cluster')
