-- 400: kind_field_path_recursion
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/400_view_kind_field_recursion.up.sql
--    :END:
-- #+NAME: Recursive kind_field_path view

create or replace recursive view kind_field_path_recursion(
  kind,
  field_path,
  field_kind,
  field_type,
  sub_kind,
  release,
  deprecated,
  gated,
  required,
  bucket,
  job
) AS
 SELECT DISTINCT
 sf.field_schema AS kind,
 sf.field_name AS field_path, -- this becomes a path
 sf.field_kind AS field_kind,
 sf.field_type AS field_type,
 sf.field_schema AS sub_kind, -- this is the kind at this level
 sf.release AS release,
 sf.deprecated AS deprecated, 
 sf.feature_gated AS feature_gated,
 sf.required AS required,
 sf.bucket as bucket,
 sf.job as job
 from api_schema_field sf
 UNION
 SELECT
  kfpr.kind AS kind,
  ( kfpr.field_path || '.' || f.field_name ) AS field_path,
  f.field_kind AS field_kind,
  f.field_type AS field_type,
  CASE
  WHEN f.field_kind = 'string' OR f.field_kind = 'integer' THEN f.field_schema
  ELSE f.field_kind
   END as sub_kind,
  f.release AS release,
  f.deprecated AS deprecated,
  f.feature_gated AS feature_gated,
  f.required AS required,
  kfpr.bucket,
  kfpr.job
  FROM api_schema_field f
  INNER JOIN kind_field_path_recursion kfpr ON
  f.field_schema = kfpr.field_kind
  AND f.field_kind not like 'io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.%.JSONSchemaProps';
;
