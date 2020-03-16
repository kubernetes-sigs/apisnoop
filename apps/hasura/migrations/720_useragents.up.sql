CREATE OR REPLACE VIEW "public"."useragents" AS
  WITH raw_useragents AS (
    SELECT audit_event.operation_id,
           audit_event.bucket,
           audit_event.job,
           audit_event.useragent
      FROM audit_event
     WHERE (audit_event.job <> 'live'::text)
  )
  SELECT DISTINCT raw_useragents.bucket,
                  raw_useragents.job,
                  raw_useragents.useragent,
                  array_agg(DISTINCT raw_useragents.operation_id) AS operation_ids
    FROM raw_useragents
   GROUP BY raw_useragents.useragent, raw_useragents.bucket, raw_useragents.job;
