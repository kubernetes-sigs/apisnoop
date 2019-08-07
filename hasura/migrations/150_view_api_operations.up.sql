-- api_operations view
--     This grabs the 'paths' section of our swagger.json, where each path contains operation Id, tags, schemes, etc.
-- #+NAME: api_operations view

CREATE OR REPLACE VIEW "public"."api_operations" AS 
  SELECT raw_swaggers.id AS raw_swagger_id,
         paths.key AS path,
         regex_from_path(paths.key) as regex,
         d.key AS method,
         (d.value ->> 'operationId'::text) AS operation_id,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'group'::text) AS k8s_group,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'version'::text) AS k8s_version,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'kind'::text) AS k8s_kind,
         (d.value ->> 'description'::text) AS description,
         (d.value ->> 'x-kubernetes-action'::text) AS x_kubernetes_action,
         (d.value -> 'consumes'::text) AS consumes,
         (d.value -> 'responses'::text) AS responses,
         (d.value -> 'parameters'::text) AS parameters,
         (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) AS deprecated,
         split_part((cat_tag.value ->> 0), '_'::text, 1) AS category,
         string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS tags,
         string_agg(btrim((schemestring.value)::text, '"'::text), ', '::text) AS schemes
    FROM raw_swaggers
    , jsonb_each((raw_swaggers.data -> 'paths'::text)) paths(key, value)
    , jsonb_each(paths.value) d(key, value)
    , jsonb_array_elements((d.value -> 'tags'::text)) cat_tag(value)
    , jsonb_array_elements((d.value -> 'tags'::text)) jsonstring(value)
    , jsonb_array_elements((d.value -> 'schemes'::text)) schemestring(value)
   GROUP BY raw_swaggers.id, paths.key, d.key, d.value, cat_tag.value
   ORDER BY paths.key;
