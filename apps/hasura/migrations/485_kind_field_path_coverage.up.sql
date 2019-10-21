-- 485: kind_field_path_coverage
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/485_kind_field_path_coverage.up.sql
--    :END:
--    A view into our material,  so hasura can track it.
--    #+NAME: kind_field_path_coverage

CREATE OR REPLACE VIEW "public"."kind_field_path_coverage" AS
 select * from kind_field_path_coverage_material;
