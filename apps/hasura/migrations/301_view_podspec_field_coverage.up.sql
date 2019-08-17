-- 301: PodSpec Field Coverage View
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/301_view_podspec_field_coverage.up.sql
--   :END:
-- #+NAME: view podspec_field_coverage

create view podspec_field_coverage as select * from podspec_field_coverage_material;
