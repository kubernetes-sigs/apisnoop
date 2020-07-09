CREATE OR REPLACE FUNCTION load_tests()
RETURNS text AS $$
from string import Template
import json
import yaml
from urllib.request import urlopen, urlretrieve

TESTS_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/test/conformance/testdata/conformance.yaml"
tests = json.dumps(yaml.safe_load(urlopen(TESTS_URL)))
sql = Template("""
              WITH jsonb_array AS (
              SELECT jsonb_array_elements('${tests}'::jsonb) as test_data)
              INSERT INTO test(testname, codename, release, description, file)
                 SELECT
                 (test_data->>'testname') as testname,
                 (test_data->>'codename') as codename,
                 CASE
                   WHEN ((test_data->>'release') = '') THEN '1.9.0'
                   WHEN ((test_data->>'release') like '%,%')
                     THEN trim(leading 'v' from split_part((test_data->>'release'), ', ', 2))||'.0'
                   ELSE trim(leading 'v' from (test_data->>'release')) ||'.0'
                 END as release,
                 (test_data->>'description') as description,
                 (test_data->>'file') as file
                 from jsonb_array;
              """).substitute(tests = tests.replace("'","''"))
try:
    plpy.execute(sql)
    return 'conformance.yaml loaded into test!'
except Exception as e:
    return 'error occured: ', e
$$ LANGUAGE plpython3u;

comment on function load_tests is 'loads latest conformance.yaml into test table';
