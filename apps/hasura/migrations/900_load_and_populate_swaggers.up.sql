-- 900: Populate bucket_job_swagger Up
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/900_load_and_populate_swaggers.up.sql
--   :header-args:sql-mode+: :results silent
--   :END:
--   We need to be careful with this, in that 3 months from now this function will not work as the bucket will not be in the kubernetes storage.
  
-- #+NAME: reload swaggers for particluar releases

delete from bucket_job_swagger;
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1173412183980118017');
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1178464478988079104');
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1181584183475048448');
 REFRESH MATERIALIZED VIEW api_operation_material;
 -- HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view^
-- REFRESH MATERIALIZED VIEW CONCURRENTLY api_operation_parameter_material;
