-- 199: Populate Swaggers Up
--   :PROPERTIES:
--   :header-args:sql-mode+: :results silent
--   :END:
-- #+NAME: reload swaggers for particluar releases

delete from api_swagger;
select * from load_swagger_via_curl('master');
REFRESH MATERIALIZED VIEW api_operation_material;
-- HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view^
REFRESH MATERIALIZED VIEW CONCURRENTLY api_operation_parameter_material;
-- select * from load_swagger_via_curl('release-1.15');
-- select * from load_swagger_via_curl('release-1.14');
-- select * from load_swagger_via_curl('release-1.13');
-- select * from load_swagger_via_curl('release-1.12');
-- select * from load_swagger_via_curl('release-1.11');
-- select * from load_swagger_via_curl('release-1.10');
