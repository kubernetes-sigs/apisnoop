-- api_operations view
-- #+NAME: api_operations view

-- DROP VIEW api_operations CASCADE;
CREATE OR REPLACE VIEW "public"."api_operations" AS 
  SELECT (d.value ->> 'operationId'::text) AS operation_id,
         uuid_generate_v1() as id,
         raw_paths.raw_swagger_id as raw_swagger_id,
         d.key AS method,
         raw_paths.path as path,
         regex_from_path(raw_paths.path) as regex,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'group'::text) AS k8s_group,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'version'::text) AS k8s_version,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'kind'::text) AS k8s_kind,
         ( SELECT split_part((cat_tag.value ->> 0), '_'::text, 1) AS split_part
             FROM jsonb_array_elements((d.value -> 'tags'::text)) cat_tag(value)) AS category,
         (d.value ->> 'description'::text) AS description,
         (d.value ->> 'x-kubernetes-action'::text) AS x_kubernetes_action,
         ( SELECT string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS string_agg
              FROM jsonb_array_elements((d.value -> 'tags'::text)) jsonstring(value)) AS tags,
         ( SELECT string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS string_agg
              FROM jsonb_array_elements((d.value -> 'schemes'::text)) jsonstring(value)) AS schemes,
         (d.value -> 'consumes'::text) AS consumes,
         (d.value -> 'responses'::text) AS responses,
         (d.value -> 'parameters'::text) AS parameters,
         (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) AS deprecated
    FROM (raw_paths
          JOIN LATERAL jsonb_each(raw_paths.value) d(key, value) ON (true))
   ORDER BY (d.value ->> 'operationId'::text);
