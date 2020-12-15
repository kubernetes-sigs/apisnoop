#!/bin/env python

# Tiltfile
#   a fast development flow for APISnoop

namespace = 'apisnoop'
containerRepoSnoopDB = 'gcr.io/k8s-staging-apisnoop/snoopdb'
containerRepoAuditLogger = 'gcr.io/k8s-staging-apisnoop/auditlogger'

snoopDBYaml = helm(
  'charts/snoopdb',
  name='snoopdb',
  namespace=namespace,
  set=[]
  )
k8s_yaml(snoopDBYaml)

auditLoggerYaml = helm(
  'charts/auditlogger',
  name='auditlogger',
  namespace=namespace,
  set=[]
  )
k8s_yaml(auditLoggerYaml)

k8s_resource(workload='snoopdb', port_forwards=5432)

if os.getenv('SHARINGIO_PAIR_NAME'):
    custom_build(containerRepoSnoopDB, 'docker build -f apps/snoopdb/postgres/Dockerfile -t $EXPECTED_REF apps/snoopdb/postgres', ['apps/snoopdb/postgres'], disable_push=True)
    custom_build(containerRepoAuditLogger, 'docker build -f apps/auditlogger/Dockerfile -t $EXPECTED_REF apps/auditlogger', ['apps/auditlogger'], disable_push=True)
else:
    docker_build(containerRepoSnoopDB, 'apps/snoopdb/postgres', dockerfile="apps/snoopdb/postgres/Dockerfile")
    docker_build(containerRepoAuditLogger, 'apps/auditlogger', dockerfile="apps/auditlogger/Dockerfile")

allow_k8s_contexts('in-cluster')
