-- 500: Endpoint Coverage Material View
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/500_view_endpoint_coverage_material.up.sql
--     :END:

--     developed in [[file:explorations/ticket_50_endpoint_coverage.org][ticket 50: endpoint coverage]]
   
--     #+NAME: Endpoint Coverage View

-- [[file:~/apisnoop/apps/hasura/index.org::Endpoint%20Coverage%20View][Endpoint Coverage View]]
CREATE MATERIALIZED VIEW "public"."endpoint_coverage_material" AS
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
   (count (*) FILTER (where coverage.operation_id = ao.operation_id AND test_hit is true) > 0) as tested,
   (count (*) FILTER (where coverage.operation_id = ao.operation_id AND conf_test_hit is true) > 0) as conf_tested,
   (count (*) FILTER (where coverage.operation_id = ao.operation_id) > 0) as hit
   FROM api_operation_material ao
          LEFT JOIN bucket_job_swagger bjs ON (ao.bucket = bjs.bucket AND ao.job = bjs.job)
          LEFT JOIN (
            SELECT  DISTINCT
              operation_id,
              bucket,
              job,
              test_hit,
              conf_test_hit
              FROM
                  audit_event
            ) as coverage ON (coverage.bucket = ao.bucket AND coverage.job = ao.job)
     WHERE ao.deprecated IS False
   GROUP BY ao.operation_id, ao.bucket, ao.job, date, ao.level, ao.category, ao.k8s_group, ao.k8s_kind, ao.k8s_version;
-- Endpoint Coverage View ends here

-- Index
--     #+NAME: Add indexes 

-- [[file:~/apisnoop/apps/hasura/index.org::Add%20indexes][Add indexes]]
CREATE INDEX idx_endpoint_coverage_material_job ON endpoint_coverage_material (job);
-- Add indexes ends here
