create or replace function load_tests()

returns text AS $$

from string import Template
import json
import yaml
from urllib.request import urlopen, urlretrieve

TESTS_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/test/conformance/testdata/conformance.yaml"
tests = json.dumps(yaml.safe_load(urlopen(TESTS_URL)))
sql = Template("""
              with jsonb_array AS (
              select jsonb_array_elements('${tests}'::jsonb) as test_data)
              insert into conformance.test(testname, codename, release, description, file)
                 select
                 (test_data->>'testname') as testname,
                 (test_data->>'codename') as codename,
                 case
                   when ((test_data->>'release') = '') then '1.9.0'
                   when ((test_data->>'release') like '%,%')
                     then trim(leading 'v' from split_part((test_data->>'release'), ', ', 2))||'.0'
                   else trim(leading 'v' from (test_data->>'release')) ||'.0'
                 end as release,
                 (test_data->>'description') as description,
                 (test_data->>'file') as file
                 from jsonb_array;
              """).substitute(tests = tests.replace("'","''"))
try:
    plpy.execute(sql)
    return 'conformance.yaml loaded into conformance.test!'
except Exception as e:
    return 'error occured: ', e
$$ LANGUAGE plpython3u;

comment on function load_tests is 'loads latest conformance.yaml into test table';

select 'load_tests function defined and commented' as "build log";
