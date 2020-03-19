set role dba;
CREATE OR REPLACE FUNCTION add_op_id() RETURNS TRIGGER as $$
   import json
   from snoopUtils import load_openapi_spec, find_operation_id
   if "spec" not in GD:
       GD["spec"] = load_openapi_spec('https://raw.githubusercontent.com/kubernetes/kubernetes/7d13dfe3c34f44/api/openapi-spec/swagger.json')
   spec = GD["spec"]
   event = json.loads(TD["new"]["data"])
   if TD["new"]["operation_id"] is None:
       TD["new"]["operation_id"] = find_operation_id(spec, event);
   return "MODIFY";
$$ LANGUAGE plpython3u;
reset role;
