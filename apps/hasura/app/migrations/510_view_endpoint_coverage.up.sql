-- 510: Endpoint Coverage View
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/510_view_endpoint_coverage.up.sql
--     :END:
--      #+NAME: endpoint_coverage_material

-- [[file:~/apisnoop/apps/hasura/index.org::endpoint_coverage_material][endpoint_coverage_material]]
CREATE OR REPLACE VIEW "public"."endpoint_coverage" AS
SELECT
  *
  FROM
      endpoint_coverage_material;
-- endpoint_coverage_material ends here
