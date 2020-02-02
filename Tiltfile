k8s_yaml(['deployment/k8s/graphql.yaml',
         'deployment/k8s/audit-sink.yaml',
         'deployment/k8s/nginx-mandatory.yaml',
         'deployment/k8s/nginx-kind.yaml',
         'deployment/k8s/ingress.yaml'
         ]
)
docker_build('raiinbow/webapp', 'apps/webapp',
  live_update=[
  fall_back_on(['package.json', 'package-lock.json']),
  sync('apps/webapp','/src')
  ])
docker_build('raiinbow/hasura', 'apps/hasura')
# docker_build('raiinbow/postgres', 'apps/postgres')
docker_build('raiinbow/auditlogger', 'apps/auditlogger')
k8s_resource('hasura', port_forwards='8080')
k8s_resource('postgres', port_forwards='54321')
k8s_resource('webapp', port_forwards='8081')
allow_k8s_contexts('in-cluster')
