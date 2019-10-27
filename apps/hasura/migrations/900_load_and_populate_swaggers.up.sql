


  
-- #+NAME: reload swaggers for particluar releases

delete from bucket_job_swagger;
 --select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1154232155547635716');
 --select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1165794879855398916');
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1173412183980118017');
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1178464478988079104');
 select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1186669076815024132');
 REFRESH MATERIALIZED VIEW api_operation_material;
 -- HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view^
-- REFRESH MATERIALIZED VIEW CONCURRENTLY api_operation_parameter_material;
