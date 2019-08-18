-- Create
--  #+NAME: Responses View

CREATE OR REPLACE VIEW "public"."api_operation_response" AS 
  SELECT api_operation.operation_id,
         d.key AS code,
         (d.value ->> 'description'::text) AS description,
         replace(
           CASE
           WHEN (((d.value -> 'schema'::text) IS NOT NULL) AND (((d.value -> 'schema'::text) -> 'type'::text) IS NOT NULL))
             THEN ((d.value -> 'schema'::text) ->> 'type'::text)
           WHEN (((d.value -> 'schema'::text) IS NOT NULL) AND (((d.value -> 'schema'::text) -> '$ref'::text) IS NOT NULL))
             THEN ((d.value -> 'schema'::text) ->> '$ref'::text)
           ELSE NULL::text
           END, '#/definitions/','') AS resource,
           api_operation.raw_swagger_id
    FROM (api_operation
          JOIN LATERAL jsonb_each(api_operation.responses) d(key, value) ON (true))
   ORDER BY (uuid_generate_v1());
