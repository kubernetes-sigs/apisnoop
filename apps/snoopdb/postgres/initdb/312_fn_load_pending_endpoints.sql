      create or replace function load_pending_endpoints (
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
      PENDING_ENDPOINTS = "/test/conformance/testdata/pending_eligible_endpoints.yaml"
      PENDING_URL = K8S_REPO_URL + MAIN_BRANCH + PENDING_ENDPOINTS

      list_of_endpoints = yaml.safe_load(urlopen(PENDING_URL))
      pending_endpoint_list = [dict(zip(["endpoint"],[list_of_endpoints[endpoint]])) for endpoint in range(0,len(list_of_endpoints))]
      pending_endpoints = Template("$pending_endpoint_list").substitute(pending_endpoint_list= pending_endpoint_list)

      sql = Template("""
                   with jsonb_array AS (
                   select jsonb_array_elements('${pending_endpoints}'::jsonb) as endpoint_data)
                   insert into conformance.pending_endpoint(endpoint)
                      select
                      (endpoint_data->>'endpoint') as endpoint
                      from jsonb_array;
                   """).substitute(pending_endpoints = pending_endpoints.replace("'","\""))
      try:
          plpy.execute(sql)
          return 'pending endpoints loaded!'
      except Exception as e:
          return 'error occured: ', e
     $$ LANGUAGE plpython3u;

     comment on function load_pending_endpoints is 'loads pending endpoints from k8s/k8s/test/conformance/testdata';

     select 'load_pending_endpoints function defined and commented' as "build log";
