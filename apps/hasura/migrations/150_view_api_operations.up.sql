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





-- #+NAME: api_operations_material

CREATE MATERIALIZED VIEW "public"."api_operations_material" AS 
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

-- #+NAME: index the raw_audit_events

-- CREATE INDEX idx_api_operations_material_primary ON api_operations_material USING (raw_swagger_id, event_verb, regex);
-- CREATE INDEX idx_audit_events_level_btree      ON raw_audit_events USING BTREE ((data->>'level'));
-- CREATE INDEX idx_audit_events_level_hash       ON raw_audit_events USING HASH  ((data->>'level'));
-- CREATE INDEX idx_api_operations_material_jsonb_ops ON raw_audit_events USING GIN (data jsonb_ops);
-- CREATE INDEX idx_audit_events_jsonb_path_jobs  ON raw_audit_events USING GIN (data jsonb_path_ops);
-- CREATE INDEX idx_audit_events_level_btree      ON raw_audit_events USING BTREE ((data->>'level'));
-- CREATE INDEX idx_audit_events_level_hash       ON raw_audit_events USING HASH  ((data->>'level'));
-- CREATE INDEX idx_audit_events_stage_btree      ON raw_audit_events USING BTREE ((data->>'stage'));
-- CREATE INDEX idx_audit_events_stage_hash       ON raw_audit_events USING HASH  ((data->>'stage'));
-- CREATE INDEX idx_audit_events_verb_btree       ON raw_audit_events USING BTREE ((data->>'verb'));
-- CREATE INDEX idx_audit_events_verb_hash        ON raw_audit_events USING HASH  ((data->>'verb'));
-- CREATE INDEX idx_audit_events_apiVersion_btree ON raw_audit_events USING BTREE ((data->>'apiVersion'));
-- CREATE INDEX idx_audit_events_apiVersion_hash  ON raw_audit_events USING HASH  ((data->>'apiVersion'));
-- CREATE INDEX idx_audit_events_requestURI_btree ON raw_audit_events USING BTREE ((data->>'requestURI'));
-- CREATE INDEX idx_audit_events_requestURI_hash  ON raw_audit_events USING HASH  ((data->>'requestURI'));
-- CREATE INDEX idx_audit_events_userAgent_btree  ON raw_audit_events USING BTREE ((data->>'userAgent'));
-- CREATE INDEX idx_audit_events_userAgent_hash   ON raw_audit_events USING HASH  ((data->>'userAgent'));
-- CREATE INDEX idx_audit_events_namespace_btree  ON raw_audit_events USING BTREE ((data->'objectRef' ->> 'namespace'));
-- CREATE INDEX idx_audit_events_namespace_hash   ON raw_audit_events USING HASH  ((data->'objectRef' ->> 'namespace'));
-- CREATE INDEX idx_audit_events_resource_btree   ON raw_audit_events USING BTREE ((data->'objectRef' ->> 'resource'));
-- CREATE INDEX idx_audit_events_resource_hash    ON raw_audit_events USING HASH  ((data->'objectRef' ->> 'resource'));
-- CREATE INDEX idx_audit_events_apiGroup_btree   ON raw_audit_events USING BTREE ((data->'objectRef' ->> 'apiGroup'));
-- CREATE INDEX idx_audit_events_apiGroup_hash    ON raw_audit_events USING HASH  ((data->'objectRef' ->> 'apiGroup'));
-- CREATE INDEX idx_audit_events_apiVersion_btree ON raw_audit_events USING BTREE ((data->'objectRef' ->> 'apiVersion'));
-- CREATE INDEX idx_audit_events_apiVersion_hash  ON raw_audit_events USING HASH  ((data->'objectRef' ->> 'apiVersion'));
-- CREATE INDEX idx_audit_events_requests_gin     ON raw_audit_events USING GIN ((data->'requestObject'));
-- CREATE INDEX idx_audit_events_requests_gin     ON raw_audit_events USING GIN ((data->'requestObject'));
-- CREATE INDEX idx_audit_events_namespace_hash   ON raw_audit_events USING HASH  ((data->'objectRef' ->> 'namespace'));
-- CREATE INDEX idx_audit_events_X_gin  ON raw_audit_events USING GIN ((data->'X'));
-- CREATE INDEX idx_audit_events_X_btree ON raw_audit_events USING BTREE ((data->'X'));
-- CREATE INDEX idx_audit_events_X_hash ON raw_audit_events USING HASH ((data->'X'));
-- CREATE INDEX idx_audit_events_X ON raw_audit_events USING GIN ((jsb->‘X’));
-- CREATE INDEX idx_audit_events_X ON raw_audit_events USING BTREE ((jsb->>‘X’));
-- CREATE INDEX idx_audit_events_X ON raw_audit_events USING HASH ((jsb->>‘X’))
