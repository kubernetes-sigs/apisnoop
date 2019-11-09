-- 910: Populate Swaggers Up
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/910_load_and_populate_swaggers.up.sql
--   :header-args:sql-mode+: :results silent
--   :END:

select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1188637253832806405');
-- create an apisnoop/live bucket/job by setting third argument(live) to true.
select * from load_bucket_job_swagger_via_curl('ci-kubernetes-e2e-gci-gce', '1188637253832806405', true);
