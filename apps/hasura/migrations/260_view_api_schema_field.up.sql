-- Create
-- #+NAME: api_schema_field view

CREATE OR REPLACE VIEW "public"."api_schema_field" AS 
  SELECT api_schema.schema_name as field_schema,
         d.key AS field_name,
         replace(
           CASE
           WHEN d.value->>'type' = 'string' THEN 'string'
           WHEN d.value->>'type' IS NULL THEN d.value->>'$ref'
           WHEN d.value->>'type' = 'array'
            AND d.value->'items'->> 'type' IS NULL
             THEN d.value->'items'->>'$ref'
           WHEN d.value->>'type' = 'array'
            AND d.value->'items'->>'$ref' IS NULL
             THEN d.value->'items'->>'type'
           ELSE 'integer'::text
           END, '#/definitions/','') AS field_kind,
         CASE
         WHEN d.value->>'type' IS NULL THEN 'subtype'
         ELSE d.value->>'type'
           END AS field_type,
         d.value->>'description' AS description,
         CASE
         WHEN d.key = ANY(api_schema.required_fields) THEN true
         ELSE false
           END AS required,
         CASE
         WHEN (   d.value->>'description' ilike '%This field is alpha-level%'
               or d.value->>'description' ilike '%This is an alpha field%'
               or d.value->>'description' ilike '%This is an alpha feature%') THEN 'alpha'
         WHEN (   d.value->>'description' ilike '%This field is beta-level%'
               or d.value->>'description' ilike '%This field is beta%'
               or d.value->>'description' ilike '%This is a beta feature%'
               or d.value->>'description' ilike '%This is an beta feature%'
               or d.value->>'description' ilike '%This is an beta field%') THEN 'beta'
         ELSE 'ga'
           END AS release,
         CASE
         WHEN  d.value->>'description' ilike '%deprecated%' THEN true
          ELSE false
          END AS deprecated,
         CASE
         WHEN ( d.value->>'description' ilike '%requires the % feature gate to be enabled%'
               or d.value->>'description' ilike '%depends on the % feature gate being enabled%'
               or d.value->>'description' ilike '%requires the % feature flag to be enabled%'
               or d.value->>'description' ilike '%honored if the API server enables the % feature gate%'
               or d.value->>'description' ilike '%honored by servers that enable the % feature%'
               or d.value->>'description' ilike '%requires enabling % feature gate%'
               or d.value->>'description' ilike '%honored by clusters that enables the % feature%'
               or d.value->>'description' ilike '%only if the % feature gate is enabled%'
               ) THEN true
         ELSE false
           END AS feature_gated,
         d.value->>'format' AS format,
         d.value->>'x-kubernetes-patch-merge-key' AS merge_key,
         d.value->>'x-kubernetes-patch-strategy' AS patch_strategy,
         api_schema.bucket,
         api_schema.job,
         d.value
    FROM (api_schema
          JOIN LATERAL jsonb_each(api_schema.properties) d(key, value) ON (true));
