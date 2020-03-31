-- 210: api_operation
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/210_view_api_operation.up.sql
--     :END:
  

-- [[file:~/apisnoop/apps/hasura/index.org::*210:%20api_operation][210: api_operation:1]]
CREATE OR REPLACE VIEW api_operation AS
  SELECT
    *
    FROM
        api_operation_material;
-- 210: api_operation:1 ends here
