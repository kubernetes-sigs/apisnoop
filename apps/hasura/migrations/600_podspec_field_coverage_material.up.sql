-- 600: PodSpec Materialized View
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/600_podspec_field_coverage_material.up.sql
--   :END:
-- #+NAME: view podspec_field_coverage_material

CREATE MATERIALIZED VIEW "public"."podspec_field_coverage_material" AS 
SELECT DISTINCT
  audit_event.operation_id,
  jsonb_object_keys(audit_event.request_object -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits,
  split_part(audit_event.useragent, '--', 2) as test,
  split_part(audit_event.useragent, '--', 1) as useragent
  FROM audit_event,
       LATERAL
         jsonb_object_keys(audit_event.request_object -> 'spec'::text)
         event_field(event_field)
 WHERE (audit_event.request_object ->> 'kind'::text) = 'Pod'::text
   AND audit_event.operation_id !~~ '%alpha%'::text
   AND audit_event.operation_id !~~ '%beta%'::text
 GROUP BY operation_id, podspec_field, useragent
UNION
SELECT DISTINCT
  audit_event.operation_id,
  jsonb_object_keys(audit_event.request_object -> 'template' -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits,
  split_part(audit_event.useragent, '--', 2) as test,
  split_part(audit_event.useragent, '--', 1) as useragent
  FROM audit_event,
       LATERAL
         jsonb_object_keys(audit_event.request_object -> 'template' -> 'spec'::text)
         event_field(event_field)
 WHERE (audit_event.request_object ->> 'kind'::text) = 'PodTemplate'::text
   AND audit_event.operation_id !~~ '%alpha%'::text
   AND audit_event.operation_id !~~ '%beta%'::text
 GROUP BY operation_id, podspec_field, useragent
UNION
SELECT DISTINCT
  audit_event.operation_id,
  jsonb_object_keys(audit_event.request_object -> 'spec' -> 'template' -> 'spec'::text) AS podspec_field,
  count(event_field.event_field) AS hits,
  split_part(audit_event.useragent, '--', 2) as test,
  split_part(audit_event.useragent, '--', 1) as useragent
  FROM audit_event,
       LATERAL
         jsonb_object_keys(audit_event.request_object -> 'spec' -> 'template' -> 'spec'::text)
         event_field(event_field)
 WHERE (audit_event.request_object->>'kind' = 'DaemonSet'
   OR  audit_event.request_object->>'kind' = 'Deployment'
   OR  audit_event.request_object->>'kind' = 'ReplicationController'
   OR  audit_event.request_object->>'kind' = 'StatefulSet'
   OR  audit_event.request_object->>'kind' = 'Job'
   OR  audit_event.request_object->>'kind' = 'ReplicaSet')
   AND audit_event.operation_id !~~ '%alpha%'::text
   AND audit_event.operation_id !~~ '%beta%'::text
 GROUP BY operation_id, podspec_field, useragent;
