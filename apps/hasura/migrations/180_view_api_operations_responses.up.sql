-- Create   
--  #+NAME: Responses View

CREATE OR REPLACE VIEW "public"."api_operations_responses" AS 
  SELECT d.key AS code,
         (d.value ->> 'description'::text) AS description,
         replace(
           CASE
           WHEN (((d.value -> 'schema'::text) IS NOT NULL) AND (((d.value -> 'schema'::text) -> 'type'::text) IS NOT NULL))
             THEN ((d.value -> 'schema'::text) ->> 'type'::text)
           WHEN (((d.value -> 'schema'::text) IS NOT NULL) AND (((d.value -> 'schema'::text) -> '$ref'::text) IS NOT NULL))
             THEN ((d.value -> 'schema'::text) ->> '$ref'::text)
           ELSE NULL::text
           END, '#/definitions/','') AS resource,
           api_operations.operation_id,
           api_operations.raw_swagger_id
    FROM (api_operations
          JOIN LATERAL jsonb_each(api_operations.responses) d(key, value) ON (true))
   ORDER BY (uuid_generate_v1());
