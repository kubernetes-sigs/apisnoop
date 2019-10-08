-- 420: kind_field_path view
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/420_view_kind_field_path.up.sql
--    :END:
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
  required,
  bucket,
  job
 from kind_field_path_material where field_kind not like 'io%';
