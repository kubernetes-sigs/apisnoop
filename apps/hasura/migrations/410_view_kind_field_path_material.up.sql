-- 410: kind_field_path_material
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/410_view_kind_field_path_material.up.sql
--    :END:
-- #+NAME: kind_field_path material

create materialized view kind_field_path_material AS
 select
   kind,
   field_path AS field_path,
   field_kind AS field_kind,
   field_type,
   sub_kind,
   release,
   deprecated,
   gated,
   required,
   bucket,
   job
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
