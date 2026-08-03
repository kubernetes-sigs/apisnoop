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
      PENDING_ELIGIBLE_ENDPOINTS = "/test/conformance/testdata/pending_eligible_endpoints.yaml"
      PENDING_ELIGIBLE_URL = K8S_REPO_URL + MAIN_BRANCH + PENDING_ELIGIBLE_ENDPOINTS

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

      # a plain list of operation ids; the file may hold no list at all
      # (only a "No pending eligible endpoints" comment), which loads as None
      pending_eligible_endpoints = json.dumps(yaml.safe_load(urlopen(PENDING_ELIGIBLE_URL)) or [])
      pending_sql = Template("""
                   insert into conformance.pending_eligible_endpoint(endpoint)
                      select jsonb_array_elements_text('${pending_eligible_endpoints}'::jsonb);
                   """).substitute(pending_eligible_endpoints = pending_eligible_endpoints.replace("'","''"))
      try:
          plpy.execute(sql)
          plpy.execute(pending_sql)
          return 'ineligible and pending eligible endpoints loaded!'
      except Exception as e:
          return 'error occured: ', e
     $$ LANGUAGE plpython3u;

     comment on function load_ineligible_endpoints is 'loads ineligible and pending eligible endpoints from k8s/k8s/test/conformance/testdata';

     select 'load_ineligible_endpoints function defined and commented' as "build log";
