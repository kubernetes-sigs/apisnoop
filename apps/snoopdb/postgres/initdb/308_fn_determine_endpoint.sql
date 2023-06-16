create or replace function determine_endpoint() RETURNS TRIGGER as $$
   import os
   import json
   from snoopUtils import load_openapi_spec, find_operation_id

   MASTER_SWAGGER_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json"
   incluster = os.getenv('KUBERNETES_PORT')
   open_api_url = "cluster" if incluster else MASTER_SWAGGER_URL

   if "spec" not in GD:
       GD["spec"] = load_openapi_spec(url)
   spec = GD["spec"]
   event = json.loads(TD["new"]["data"])
   if TD["new"]["endpoint"] is None:
       TD["new"]["endpoint"] = find_operation_id(spec, event);
   return "modify";
$$ language plpython3u;
