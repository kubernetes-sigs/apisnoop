create or replace function determine_endpoint() RETURNS TRIGGER as $$
   import json
   from snoopUtils import load_openapi_spec, find_operation_id
   CURRENT_SWAGGER_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json"
   if "spec" not in GD:
       GD["spec"] = load_openapi_spec(CURRENT_SWAGGER_URL)
   spec = GD["spec"]
   event = json.loads(TD["new"]["data"])
   if TD["new"]["endpoint"] is None:
       TD["new"]["endpoint"] = find_operation_id(spec, event);
   return "modify";
$$ language plpython3u;
