CREATE OR REPLACE VIEW "public"."untested_stable_core_endpoints" AS
  SELECT
    ec.*,
    ao.description,
    ao.http_method,
    ao.k8s_action,
    ao.path
    FROM endpoint_coverage ec
           JOIN
           api_operation_material ao ON (ec.bucket = ao.bucket AND ec.job = ao.job AND ec.operation_id = ao.operation_id)
   WHERE ec.level = 'stable'
     AND ec.category = 'core'
     AND tested is false
     AND ao.deprecated IS false
     AND ec.job != 'live'
   ORDER BY hit desc
            ;
