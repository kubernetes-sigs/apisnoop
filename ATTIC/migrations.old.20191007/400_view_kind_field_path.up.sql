-- kind_field_path_recursion
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
  required
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
 sf.required AS required
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
  f.required AS required
  FROM api_schema_field f
  INNER JOIN kind_field_path_recursion kfpr ON
  f.field_schema = kfpr.field_kind
  AND f.field_kind not like 'io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.%.JSONSchemaProps';
;

-- kind_field_path_material
-- #+NAME: kind_field_path material

create materialized view kind_field_path_material AS
 select
   kind,
   field_path AS field_path,
   -- (text2ltree(field_path)) AS field_path, -- results in errors for now
   field_kind AS field_kind,
   field_type,
   sub_kind,
   release,
   deprecated,
   gated,
   required
  from kind_field_path_recursion;
-- drop materialized view kind_field_path_material cascade;

-- kind_field_path_material indexes
-- #+NAME: kind_field_path_material indexs

CREATE INDEX kfpm_kind_idx       ON kind_field_path_material (kind);
CREATE INDEX kfpm_field_path_idx ON kind_field_path_material (field_path);
CREATE INDEX kfpm_field_type_idx ON kind_field_path_material (field_type);
CREATE INDEX kfpm_sub_kind_idx   ON kind_field_path_material (sub_kind);
-- GIST requires ltree
-- CREATE INDEX kfpm_kind_idx       ON kind_field_path_material USING GIST (kind);
-- CREATE INDEX kfpm_field_path_idx ON kind_field_path_material USING GIST (field_path);
-- CREATE INDEX kfpm_field_type_idx ON kind_field_type_material USING GIST (field_type);
-- CREATE INDEX kfpm_sub_kind_idx   ON kind_field_path_material USING GIST (sub_kind);

-- kind_field_path view
-- #+NAME: kind_field_path view

create or replace view kind_field_path AS
select
  kind,
  field_path,
  field_kind,
  field_type,
  sub_kind,
  release,
  deprecated,
  gated,
  required
 from kind_field_path_material where field_kind not like 'io%';
