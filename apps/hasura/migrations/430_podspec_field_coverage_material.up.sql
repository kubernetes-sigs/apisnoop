-- 430: PodSpec Materialized View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/430_podspec_field_coverage_material.up.sql
--    :END:
    
--    #+NAME: view podspec_field_coverage_material

CREATE MATERIALIZED VIEW "public"."podspec_field_coverage_material" AS 
SELECT DISTINCT
  bucket,
  job,
  api_group,
  api_version,
  kind,
  event_verb,
  resource,
  sub_resource,
  test,
  useragent,
  jsonb_object_keys(request_object -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits
  FROM audit_events_by_gvkrv,
       LATERAL
         jsonb_object_keys(audit_events_by_gvkrv.request_object -> 'spec'::text) event_field(event_field)
 WHERE kind = 'Pod'
   AND NOT (lower(api_version) ~~ ANY('{%alpha%, %beta%}')) -- api_version doesn't contain alpha or beta;
 GROUP BY bucket, job, api_group, api_version, kind, event_verb, resource, sub_resource, test, useragent, podspec_field
      UNION
SELECT DISTINCT
  bucket,
  job,
  api_group,
  api_version,
  kind,
  event_verb,
  resource,
  sub_resource,
  test,
  useragent,
  jsonb_object_keys(request_object -> 'template' -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits
  FROM audit_events_by_gvkrv,
       LATERAL
         jsonb_object_keys(audit_events_by_gvkrv.request_object -> 'template'-> 'spec'::text) event_field(event_field)
 WHERE kind = 'PodTemplate'
   AND NOT (lower(api_version) ~~ ANY('{%alpha%, %beta%}'))
 GROUP BY bucket, job, api_group, api_version, kind, event_verb, resource, sub_resource, test, useragent, podspec_field
      UNION
SELECT DISTINCT
  bucket,
  job,
  api_group,
  api_version,
  kind,
  event_verb,
  resource,
  sub_resource,
  test,
  useragent,
  jsonb_object_keys(request_object -> 'spec' -> 'template' -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits
  FROM audit_events_by_gvkrv,
       LATERAL
         jsonb_object_keys(audit_events_by_gvkrv.request_object -> 'spec' -> 'template'-> 'spec'::text) event_field(event_field)
 WHERE kind = ANY('{DaemonSet, Deployment, ReplicationController, StatefulSet, Job,ReplicaSet}')
   AND NOT (lower(api_version) ~~ ANY('{%alpha%, %beta%}'))
 GROUP BY bucket, job, api_group, api_version, kind, event_verb, resource, sub_resource, test, useragent, podspec_field;

select distinct bucket, job from podspec_field_coverage_material;
