CREATE VIEW "public"."endpoints_hit_by_new_test" AS
  WITH live_testing_endpoints AS (
    SELECT DISTINCT
      operation_id,
      useragent,
      count(*) as hits
      FROM
          audit_event
     GROUP BY operation_id, useragent
  ), baseline AS  (
    SELECT DISTINCT
      operation_id,
      tested,
      conf_tested
      FROM endpoint_coverage
     WHERE bucket != 'apisnoop'
  )
  SELECT DISTINCT
    lte.useragent,
    lte.operation_id,
    b.tested as hit_by_ete,
    lte.hits as hit_by_new_test
    FROM live_testing_endpoints lte
           JOIN baseline b ON (b.operation_id = lte.operation_id);
