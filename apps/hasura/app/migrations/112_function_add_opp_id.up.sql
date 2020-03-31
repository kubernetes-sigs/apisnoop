-- 112: add_opp_id function
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/112_function_add_opp_id.up.sql
--     :END:
--  #+NAME: add_opp_id.sql

-- [[file:~/apisnoop/apps/hasura/index.org::add_opp_id.sql][add_opp_id.sql]]
set role dba;
CREATE OR REPLACE FUNCTION add_op_id() RETURNS TRIGGER as $$
   import json
   from snoopUtils import load_openapi_spec, find_operation_id
   # We want the openapis spec for the tagged image of k8s used by kind.
   CURRENT_K8S_TAG = "v1.17.0"
   K8S_GITHUB_RAW= "https://raw.githubusercontent.com/kubernetes/kubernetes/"
   CURRENT_SWAGGER_URL = K8S_GITHUB_RAW + CURRENT_K8S_TAG + "/api/openapi-spec/swagger.json"
   if "spec" not in GD:
       GD["spec"] = load_openapi_spec(CURRENT_SWAGGER_URL)
   spec = GD["spec"]
   event = json.loads(TD["new"]["data"])
   if TD["new"]["operation_id"] is None:
       TD["new"]["operation_id"] = find_operation_id(spec, event);
   return "MODIFY";
$$ LANGUAGE plpython3u;
reset role;
-- add_opp_id.sql ends here
