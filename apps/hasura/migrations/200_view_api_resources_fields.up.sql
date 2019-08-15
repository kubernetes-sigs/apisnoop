-- Create
-- #+NAME: api_resources_fields view

CREATE VIEW "public"."api_resources_fields" AS 
  SELECT api_resources.name as api_resource_name,
         api_resources.raw_swagger_id,
         d.key AS resource_field,
         CASE
         WHEN ((d.value ->> 'type'::text) IS NULL) THEN 'subtype'::text
         ELSE (d.value ->> 'type'::text)
           END AS param_type,
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
           END, '#/definitions/','') AS param_kind,
         (d.value ->> 'description'::text) AS description,
         (d.value ->> 'format'::text) AS format,
         (d.value ->> 'x-kubernetes-patch-merge-key'::text) AS merge_key,
         (d.value ->> 'x-kubernetes-patch-strategy'::text) AS patch_strategy,
         d.value
    FROM (api_resources
          JOIN LATERAL jsonb_each(api_resources.properties) d(key, value) ON (true));
