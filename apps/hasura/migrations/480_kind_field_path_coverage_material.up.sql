-- 480: materialized kind_field_path_coverage
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/480_kind_field_path_coverage_material.up.sql
--    :END:
--    This is the base view we use to traverse the paths later.  It grabs all relevant fields from our kind_field_path_recursion and joins it to our audit_events based on where the request_object of the event includes the relevant fieldpath.
   
--    #+NAME: kind_field_path_coverage_material_improved

CREATE MATERIALIZED VIEW "public"."kind_field_path_coverage_material" AS
SELECT
  kfpr.bucket,
  kfpr.job,
  kfpr.kind,
  kfpr.field_path,
  kfpr.field_kind,
  kfpr.sub_kind,
  (array_length(string_to_array(kfpr.field_path, '.'),1) - 1) as distance,
  ae.audit_id as audit_event_id,
  ae.useragent as useragent,
  ae.operation_id
  FROM kind_field_path_recursion kfpr
      LEFT JOIN LATERAL (select * from audit_event WHERE param_schema = kfpr.kind AND jsonb_path_exists(request_object, ('$.'||kfpr.field_path)::jsonpath)) ae ON true
  GROUP BY kfpr.kind, kfpr.field_path, kfpr.field_kind, kfpr.bucket, kfpr.job, kfpr.sub_kind, ae.audit_id, ae.useragent, ae.operation_id;
