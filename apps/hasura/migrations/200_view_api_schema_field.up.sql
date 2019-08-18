-- Create
-- #+NAME: api_schema_field view

CREATE VIEW "public"."api_schema_field" AS 
  SELECT api_schema.name as api_resource_name,
         d.key AS resource_field,
         replace(
           CASE
           WHEN ((d.value ->> 'type'::text) = 'string'::text) THEN 'string'::text
           WHEN ((d.value ->> 'type'::text) IS NULL) THEN (d.value ->> '$ref'::text)
           WHEN ((d.value ->> 'type'::text) = 'array'::text)
            AND ((d.value -> 'items'::text) ->> 'type'::text) IS NULL
             THEN ((d.value -> 'items'::text) ->> '$ref'::text)
           WHEN ((d.value ->> 'type'::text) = 'array'::text)
            AND ((d.value -> 'items'::text) ->> '$ref'::text) IS NULL
             THEN ((d.value -> 'items'::text) ->> 'type'::text)
           ELSE 'integer'::text
           END, '#/definitions/','') AS field_kind,
         (d.value ->> 'description'::text) AS description,
         CASE
         WHEN ((d.value ->> 'type'::text) IS NULL) THEN 'subtype'::text
         ELSE (d.value ->> 'type'::text)
           END AS param_type,
         (d.value ->> 'format'::text) AS format,
         (d.value ->> 'x-kubernetes-patch-merge-key'::text) AS merge_key,
         (d.value ->> 'x-kubernetes-patch-strategy'::text) AS patch_strategy,
         api_schema.raw_swagger_id,
         d.value
    FROM (api_schema
          JOIN LATERAL jsonb_each(api_schema.properties) d(key, value) ON (true));
