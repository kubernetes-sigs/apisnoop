-- 310: Audit Events By GVKRV(Group, Version, Kind, Resource(s),Verb)
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/310_view_audit_event_by_gvkrv.up.sql
--   :END:
  
--   This is a slim view, and will need to be updated to contain all useful info if/when we phase out operationID across reports.
--     #+NAME: events by gvkrv

CREATE OR REPLACE VIEW "public"."audit_events_by_gvkrv" AS
  SELECT
    CASE
    WHEN ((a.data -> 'objectRef' ->> 'apiGroup') IS NULL) THEN ''
    ELSE (a.data -> 'objectRef' ->> 'apiGroup')
          END as api_group,
    (a.data -> 'objectRef' ->>'apiVersion') as api_version,
    (a.data -> 'requestObject'->>'kind') as kind,
    (a.data -> 'objectRef'->>'resource') as resource,
      (a.data -> 'objectRef'->>'subresource') as sub_resource,
    (a.data->>'verb') as event_verb,
    operation_id,
    audit_id,
    split_part(a.useragent, '--', 2) as test,
    split_part(a.useragent, '--', 1) as useragent,
    (a.data -> 'requestObject') as request_object,
    bucket,
    job
    FROM audit_event as a
   where data->'requestObject' is not null;
