-- 500: Endpoint Coverage View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/500_view_endpoint_coverage.up.sql
--    :END:
   
--    developed in [[file:explorations/ticket_50_endpoint_coverage.org][ticket 50: endpoint coverage]] 
   
--    #+NAME: Endpoint Coverage View

CREATE OR REPLACE VIEW "public"."endpoint_coverage" AS
 SELECT DISTINCT
   bjs.job_timestamp::date as date,
   ao.bucket as bucket,
   ao.job as job,
   ao.operation_id as operation_id,
   ao.level,
   ao.category,
   ao.k8s_group as group,
   ao.k8s_kind as kind,
   ao.k8s_version as version,
   count(*) filter (where ae.useragent like 'e2e.test%') as test_hits,
   count(*) filter (where ae.useragent like 'e2e.test%' AND useragent like '%[Conformance]%') as conf_hits,
   count(*) filter (where ae.useragent not like 'e2e.test%') as other_hits,
   count(ae.useragent) total_hits
   FROM api_operation ao
          LEFT JOIN audit_event ae ON (ao.operation_id = ae.operation_id AND ao.bucket = ae.bucket AND ao.job = ae.job)
          LEFT JOIN bucket_job_swagger bjs ON (ao.bucket = bjs.bucket AND ao.job = bjs.job)
   GROUP BY ao.operation_id, ao.bucket, ao.job, date, ao.level, ao.category, ao.k8s_group, ao.k8s_kind, ao.k8s_version;
