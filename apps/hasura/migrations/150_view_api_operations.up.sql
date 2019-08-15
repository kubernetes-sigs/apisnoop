-- Create View
-- #+NAME: api_operations view

CREATE OR REPLACE VIEW "public"."api_operations" AS 
  SELECT raw_swaggers.id AS raw_swagger_id,
         paths.key AS path,
         regex_from_path(paths.key) as regex,
         d.key AS http_method,
         d.value->>'x-kubernetes-action' AS k8s_action,
         d.value->>'operationId' AS operation_id,
         d.value->'x-kubernetes-group-version-kind'->>'group' AS k8s_group,
         d.value->'x-kubernetes-group-version-kind'->>'version' AS k8s_version,
         d.value->'x-kubernetes-group-version-kind'->>'kind' AS k8s_kind,
         d.value->>'description' AS description,
         d.value->'consumes' AS consumes,
         d.value->'responses' AS responses,
         d.value->'parameters' AS parameters,
         (lower((d.value ->> 'description')) ~~ '%deprecated%') AS deprecated,
         split_part((cat_tag.value ->> 0), '_', 1) AS category,
         string_agg(btrim((jsonstring.value)::text, '"'), ', ') AS tags,
         string_agg(btrim((schemestring.value)::text, '"'), ', ') AS schemes,
         CASE
          WHEN d.value->>'x-kubernetes-action' IN ('get', 'list', 'proxy') THEN 'get'
          WHEN d.value->>'x-kubernetes-action' IN ('deleteCollection', 'delete', 'deletecollection') THEN 'delete'
          WHEN d.value->>'x-kubernetes-action' IN ('watch', 'watchlist', 'watch') THEN 'watch'
          WHEN d.value->>'x-kubernetes-action' IN ('create', 'post') THEN 'post'
          WHEN d.value->>'x-kubernetes-action' IN ( 'update', 'put' ) THEN 'put'
          WHEN d.value->>'x-kubernetes-action' = 'patch' THEN 'patch'
          WHEN d.value->>'x-kubernetes-action' = 'connect' THEN 'connect'
         ELSE NULL
           END as event_verb
    FROM raw_swaggers
    , jsonb_each(raw_swaggers.data->'paths') paths(key, value)
    , jsonb_each(paths.value) d(key, value)
    , jsonb_array_elements(d.value->'tags') cat_tag(value)
    , jsonb_array_elements(d.value->'tags') jsonstring(value)
    , jsonb_array_elements(d.value->'schemes') schemestring(value)
   GROUP BY raw_swaggers.id, paths.key, d.key, d.value, cat_tag.value
   ORDER BY paths.key;
