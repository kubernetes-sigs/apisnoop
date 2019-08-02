-- api_resources view
-- #+NAME: api_resources view

-- drop materialized view api_resources CASCADE;
-- CREATE MATERIALIZED VIEW "public"."api_resources" AS 
CREATE VIEW "public"."api_resources" AS 
 SELECT 
    uuid_generate_v1() AS id,
    raw_swaggers.id AS raw_swagger_id,
    d.key AS name,
    (d.value ->> 'type'::text) AS resource_type,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'group'::text) AS k8s_group,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'version'::text) AS k8s_version,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'kind'::text) AS k8s_kind,
    ( SELECT string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS string_agg
          FROM jsonb_array_elements((d.value -> 'required'::text)) jsonstring(value)) AS required_params,
    (d.value ->> 'required'::text) as required_params_text,
    (d.value -> 'properties'::text) AS properties,
    -- (raw_api_definitions.data ->> 'version'::text) AS source
    d.value
   FROM (raw_swaggers
     JOIN LATERAL jsonb_each((raw_swaggers.data -> 'definitions'::text)) d(key, value) ON (true))
  ORDER BY id;
