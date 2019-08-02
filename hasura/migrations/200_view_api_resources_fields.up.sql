-- api_resources_fields view
-- #+NAME: Properties View

-- DROP VIEW api_resources_properties;
-- DROP MATERIALIZED VIEW api_resources_properties;
CREATE VIEW "public"."api_resources_fields" AS 
  SELECT api_resources.id AS type_id,
         d.key AS property,
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
         -- CASE
         --   WHEN d.key is null THEN false
         --   WHEN (api_resources.required_params ? d.key) THEN true
         --   ELSE false
         --     END
         --   AS required,
         -- with param type also containing array, we don't need array as a boolean
         -- CASE
         -- WHEN ((d.value ->> 'type'::text) = 'array'::text) THEN true
         -- ELSE false
         --  END AS "array"
         d.value
    FROM (api_resources
          JOIN LATERAL jsonb_each(api_resources.properties) d(key, value) ON (true))
   ORDER BY api_resources.id;
