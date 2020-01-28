-- 210: api_operation
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/210_view_api_operation.up.sql
--   :END:
  

CREATE OR REPLACE VIEW api_operation AS
  SELECT
    *
    FROM
        api_operation_material;
