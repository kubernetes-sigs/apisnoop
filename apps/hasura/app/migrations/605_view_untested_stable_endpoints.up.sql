SELECT ec.date,
       ec.bucket,
       ec.job,
       ec.operation_id,
       ec.level,
       ec.category,
       ec."group",
       ec.kind,
       ec.version,
       ec.tested,
       ec.conf_tested,
       ec.hit,
       ao.description,
       ao.http_method,
       ao.k8s_action,
       ao.path
  FROM endpoint_coverage ec
         JOIN api_operation_material ao ON ec.bucket = ao.bucket AND ec.job = ao.job AND ec.operation_id = ao.operation_id
 WHERE ec.level = 'stable'::text AND ec.tested IS FALSE AND ao.deprecated IS FALSE AND ec.job <> 'live'::text
 ORDER BY ec.hit DESC;
