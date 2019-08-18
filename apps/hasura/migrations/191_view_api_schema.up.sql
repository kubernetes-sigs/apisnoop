-- Create
--  #+NAME: api_schema view

CREATE OR REPLACE VIEW "public"."api_schema" AS 
 SELECT 
    d.key AS schema_name,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'kind'::text) AS k8s_kind,
    (d.value ->> 'type'::text) AS resource_type,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'version'::text) AS k8s_version,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'group'::text) AS k8s_group,
    string_agg(btrim((reqstring.value)::text, '"'::text), ', '::text) AS required_fields,
    (d.value ->> 'required'::text) as required_fields_text,
    (d.value -> 'properties'::text) AS properties,
    api_swagger.id AS raw_swagger_id,
    d.value
   FROM api_swagger
     , jsonb_each((api_swagger.data -> 'definitions'::text)) d(key, value)
     , jsonb_array_elements((d.value -> 'required'::text)) reqstring(value)
   GROUP BY api_swagger.id, d.key, d.value;
