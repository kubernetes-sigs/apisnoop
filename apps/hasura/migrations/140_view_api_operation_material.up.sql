

-- #+NAME: regex_from_path.sql

set role dba;
CREATE OR REPLACE FUNCTION regex_from_path(path text)
RETURNS text AS $$
import re
if path is None:
  return None
K8S_PATH_VARIABLE_PATTERN = re.compile("{(path)}$")
VARIABLE_PATTERN = re.compile("{([^}]+)}")
path_regex = K8S_PATH_VARIABLE_PATTERN.sub("(.*)", path).rstrip('/')
path_regex = VARIABLE_PATTERN.sub("([^/]*)", path_regex).rstrip('/')
if not path_regex.endswith(")") and not path_regex.endswith("?"): 
    path_regex += "([^/]*)"
if path_regex.endswith("proxy"): 
    path_regex += "/?$"
else:
    path_regex += "$"
return path_regex
$$ LANGUAGE plpython3u ;
reset role;

-- Create
-- #+NAME: api_operation_material

CREATE MATERIALIZED VIEW "public"."api_operation_material" AS 
  SELECT api_swagger.id AS raw_swagger_id,
         paths.key AS path,
         regex_from_path(paths.key) as regex,
         d.key AS http_method,
         (d.value ->> 'x-kubernetes-action'::text) AS k8s_action,
         (d.value ->> 'operationId'::text) AS operation_id,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'group'::text) AS k8s_group,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'version'::text) AS k8s_version,
         ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'kind'::text) AS k8s_kind,
         (d.value ->> 'description'::text) AS description,
         (d.value -> 'consumes'::text)::jsonb AS consumes,
         (d.value -> 'responses'::text)::jsonb AS responses,
         (d.value -> 'parameters'::text)::jsonb AS parameters,
         (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) AS deprecated,
         split_part((cat_tag.value ->> 0), '_'::text, 1) AS category,
         string_agg(btrim((jsonstring.value)::text, '"'::text), ', '::text) AS tags,
         string_agg(btrim((schemestring.value)::text, '"'::text), ', '::text) AS schemes,
         CASE
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'get' THEN ARRAY ['get']
          WHEN (d.value ->> 'x-kubernetes-action'::text) =  'list' THEN ARRAY [ 'list' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'proxy' THEN ARRAY [ 'proxy' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'deletecollection' THEN ARRAY [ 'deletecollection' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'watch' THEN ARRAY [ 'watch' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'post' THEN ARRAY [ 'post', 'create' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) =  'put' THEN ARRAY [ 'put', 'update' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'patch' THEN ARRAY [ 'patch' ]
          WHEN (d.value ->> 'x-kubernetes-action'::text) = 'connect' THEN ARRAY [ 'connect' ]
         ELSE NULL
           END as event_verb
    FROM api_swagger
    , jsonb_each((api_swagger.data -> 'paths'::text)) paths(key, value)
    , jsonb_each(paths.value) d(key, value)
    , jsonb_array_elements((d.value -> 'tags'::text)) cat_tag(value)
    , jsonb_array_elements((d.value -> 'tags'::text)) jsonstring(value)
    , jsonb_array_elements((d.value -> 'schemes'::text)) schemestring(value)
   GROUP BY api_swagger.id, paths.key, d.key, d.value, cat_tag.value
   ORDER BY paths.key;
