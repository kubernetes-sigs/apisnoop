-- 510: Endpoint Coverage View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/510_view_endpoint_coverage.up.sql
--    :END:
--     #+NAME: endpoint_coverage_material

CREATE OR REPLACE VIEW "public"."endpoint_coverage" AS
SELECT
  *
  FROM
      endpoint_coverage_material;
