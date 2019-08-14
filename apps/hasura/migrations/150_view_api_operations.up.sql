-- api_operations view
--     This grabs the 'paths' section of our swagger.json, where each path contains operation Id, tags, schemes, etc.
-- #+NAME: api_operations view

CREATE OR REPLACE VIEW "public"."api_operations" AS 
  SELECT raw_swaggers.id AS raw_swagger_id,
         paths.key AS path,
         regex_from_path(paths.key) as regex,
         d.key AS http_method,
         (d.value ->> 'x-kubernetes-action'::text) AS k8s_action,
         (d.value ->> 'operationId'::text) AS operation_id,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'group'::text) AS k8s_group,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'version'::text) AS k8s_version,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'kind'::text) AS k8s_kind,
         (d.value ->> 'description'::text) AS description,
         (d.value -> 'consumes'::text) AS consumes,
         (d.value -> 'responses'::text) AS responses,
         (d.value -> 'parameters'::text) AS parameters,
         (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) AS deprecated,
         split_part((cat_tag.value ->> 0), '_'::text, 1) AS category,
         string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS tags,
         string_agg(btrim((schemestring.value)::text, '"'::text), ', '::text) AS schemes,
         CASE
          WHEN (d.value ->> 'x-kubernetes-action'::text) IN ('get', 'list', 'proxy') THEN 'get'
          WHEN (d.value ->> 'x-kubernetes-action'::text) IN ('deleteCollection', 'delete', 'deletecollection') THEN 'delete'
          WHEN (d.value ->> 'x-kubernetes-action'::text) IN ('watch', 'watchlist', 'watch') THEN 'watch'
          WHEN (d.value ->> 'x-kubernetes-action'::text) IN ('create', 'post') THEN 'post'
          WHEN (d.value ->> 'x-kubernetes-action'::text) IN ( 'update', 'put' ) THEN 'put'
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'patch' THEN 'patch'
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'connect' THEN 'connect'
         ELSE NULL
           END as event_verb
    FROM raw_swaggers
    , jsonb_each((raw_swaggers.data -> 'paths'::text)) paths(key, value)
    , jsonb_each(paths.value) d(key, value)
    , jsonb_array_elements((d.value -> 'tags'::text)) cat_tag(value)
    , jsonb_array_elements((d.value -> 'tags'::text)) jsonstring(value)
    , jsonb_array_elements((d.value -> 'schemes'::text)) schemestring(value)
   GROUP BY raw_swaggers.id, paths.key, d.key, d.value, cat_tag.value
   ORDER BY paths.key;

-- indexes

-- #+NAME: index the api_operations_material

CREATE UNIQUE INDEX                                  ON api_operations_material(raw_swagger_id, http_method, regex);
CREATE INDEX api_operations_materialized_event_verb  ON api_operations_material            (event_verb);
CREATE INDEX api_operations_materialized_k8s_action  ON api_operations_material            (k8s_action);
CREATE INDEX api_operations_materialized_k8s_group   ON api_operations_material            (k8s_group);
CREATE INDEX api_operations_materialized_k8s_version ON api_operations_material            (k8s_version);
CREATE INDEX api_operations_materialized_k8s_kind    ON api_operations_material            (k8s_kind);
CREATE INDEX api_operations_materialized_tags        ON api_operations_material            (tags);
CREATE INDEX api_operations_materialized_schemes     ON api_operations_material            (schemes);
CREATE INDEX api_operations_materialized_regex_gist  ON api_operations_material USING GIST (regex gist_trgm_ops);
CREATE INDEX api_operations_materialized_regex_gin   ON api_operations_material USING GIN  (regex gin_trgm_ops);
CREATE INDEX api_operations_materialized_consumes_ops   ON api_operations_material USING GIN  (consumes jsonb_ops);
CREATE INDEX api_operations_materialized_consumes_path  ON api_operations_material USING GIN  (consumes jsonb_path_ops);
CREATE INDEX api_operations_materialized_parameters_ops   ON api_operations_material USING GIN  (parameters jsonb_ops);
CREATE INDEX api_operations_materialized_parameters_path  ON api_operations_material USING GIN  (parameters jsonb_path_ops);
CREATE INDEX api_operations_materialized_responses_ops   ON api_operations_material USING GIN  (responses jsonb_ops);
CREATE INDEX api_operations_materialized_responses_path  ON api_operations_material USING GIN  (responses jsonb_path_ops);
