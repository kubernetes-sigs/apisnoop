-- 920: Populate Audits Up
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/920_populate_audit_events.up.sql
--     :END:

-- [[file:~/apisnoop/apps/hasura/index.org::*920:%20Populate%20Audits%20Up][920: Populate Audits Up:1]]
select * from load_audit_events();
REFRESH MATERIALIZED VIEW api_operation_material;
REFRESH MATERIALIZED VIEW api_operation_parameter_material;
REFRESH MATERIALIZED VIEW endpoint_coverage_material;
-- 920: Populate Audits Up:1 ends here
