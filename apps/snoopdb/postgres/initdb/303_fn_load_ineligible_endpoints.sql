      create or replace function load_ineligible_endpoints (
        custom_release text default null
        )
      returns text AS $$
      from string import Template
      import json
      from urllib.request import urlopen, urlretrieve
      import urllib
      import yaml

      K8S_REPO_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/"
      MAIN_BRANCH = "master"
      INELIGIBLE_ENDPOINTS = "/test/conformance/testdata/ineligible_endpoints.yaml"
      INELIGIBLE_URL = K8S_REPO_URL + MAIN_BRANCH + INELIGIBLE_ENDPOINTS

      ineligible_endpoints = json.dumps(yaml.safe_load(urlopen(INELIGIBLE_URL)))
      sql = Template("""
                   with jsonb_array AS (
                   select jsonb_array_elements('${ineligible_endpoints}'::jsonb) as endpoint_data)
                   insert into conformance.ineligible_endpoint(endpoint, reason, link)
                      select
                      (endpoint_data->>'endpoint') as endpoint,
                      (endpoint_data->>'reason') as reason,
                      (endpoint_data->>'link') as link
                      from jsonb_array;
                   """).substitute(ineligible_endpoints = ineligible_endpoints.replace("'","''"))
      try:
          plpy.execute(sql)
          return 'ineligible endpoints loaded!'
      except Exception as e:
          return 'error occured: ', e
     $$ LANGUAGE plpython3u;

     comment on function load_ineligible_endpoints is 'loads ineligible endpoints from k8s/k8s/test/conformance/testdata';

     select 'load_ineligible_endpoints function defined and commented' as "build log";
