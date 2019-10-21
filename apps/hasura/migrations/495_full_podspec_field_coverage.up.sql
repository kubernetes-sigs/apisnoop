-- 495: full_podspec_field_coverage
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/495_full_podspec_field_coverage.up.sql
--    :END:
--    And we can create a view from this
--    #+NAME: full_podspec_field_coverage

CREATE OR REPLACE VIEW "public"."full_podspec_field_coverage" AS
 select * from full_podspec_field_coverage_material;
