-- api_resources view
-- #+NAME: api_resources view

CREATE OR REPLACE VIEW "public"."api_resources" AS 
 SELECT 
    raw_swaggers.id AS raw_swagger_id,
    d.key AS name,
    (d.value ->> 'type'::text) AS resource_type,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'group'::text) AS k8s_group,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'version'::text) AS k8s_version,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'kind'::text) AS k8s_kind,
    ((d.value -> 'required'::text)) as required_params,
    (d.value -> 'properties'::text) AS properties,
    d.value
   FROM raw_swaggers
     , jsonb_each((raw_swaggers.data -> 'definitions'::text)) d(key, value)
   GROUP BY raw_swaggers.id, d.key, d.value;
