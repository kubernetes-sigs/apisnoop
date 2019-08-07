

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
