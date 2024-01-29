create or replace function load_open_api (
  custom_release text default null
  )
returns text AS $$
from string import Template
import json
import time
import datetime
from urllib.request import urlopen, urlretrieve
import urllib
import yaml

K8S_REPO_URL = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
OPEN_API_PATH = '/api/openapi-spec/swagger.json'
RELEASES_URL = 'https://raw.githubusercontent.com/kubernetes-sigs/apisnoop/main/resources/coverage/releases.yaml'

# Get info about latest release from our releases.yaml
releases = yaml.safe_load(urlopen(RELEASES_URL))
latest_release = releases[0]

# Set values for sql template  based on if custom_release argument was passed
if custom_release is not None:
  open_api_url = K8S_REPO_URL + 'v' + custom_release  + OPEN_API_PATH
# check to see if we can load this custom_release url
  try:
    open_api = json.loads(urlopen(open_api_url).read().decode('utf-8'))
    release = custom_release
    rd = [r for r in releases if r['version'] == release][0]['release_date']
    release_date = time.mktime(datetime.datetime.strptime(str(rd), "%Y-%m-%d").timetuple())
  except urllib.error.HTTPError as e:
    raise ValueError('http error with', custom_release)
else:
  open_api_url = K8S_REPO_URL + 'master' + OPEN_API_PATH
  open_api = json.loads(urlopen(open_api_url).read().decode('utf-8'))
  release = latest_release['version']
  release_date = time.mktime(datetime.datetime.now().timetuple())
sql = Template("""
   WITH open AS (
     SELECT '${open_api}'::jsonb as api_data
     )
       INSERT INTO open_api(
         release,
         release_date,
         endpoint,
         level,
         category,
         path,
         k8s_group,
         k8s_version,
         k8s_kind,
         k8s_action,
         deprecated,
         description,
         spec
       )
   SELECT
     '${release}' as release,
     to_timestamp(${release_date}) as release_date,
     (d.value ->> 'operationId'::text) as endpoint,
     CASE
       WHEN paths.key ~~ '%alpha%' THEN 'alpha'
       WHEN paths.key ~~ '%beta%' THEN 'beta'
       -- these endpoints are beta, but are not marked as such, yet, in the swagger.json
       WHEN (d.value ->> 'operationId'::text) = any('{"getServiceAccountIssuerOpenIDConfiguration", "getServiceAccountIssuerOpenIDKeyset"}') THEN 'beta'
       ELSE 'stable'
     END AS level,
     split_part((cat_tag.value ->> 0), '_'::text, 1) AS category,
     paths.key AS path,
     ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'group'::text) AS k8s_group,
     ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'version'::text) AS k8s_version,
     ((d.value -> 'x-kubernetes-group-version-kind'::text) ->> 'kind'::text) AS k8s_kind,
     (d.value ->> 'x-kubernetes-action'::text) AS k8s_action,
     CASE
       WHEN (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) THEN true
       ELSE false
     END AS deprecated,
                 (d.value ->> 'description'::text) AS description,
                 '${open_api_url}' as spec
     FROM
         open
          , jsonb_each((open.api_data -> 'paths'::text)) paths(key, value)
          , jsonb_each(paths.value) d(key, value)
          , jsonb_array_elements((d.value -> 'tags'::text)) cat_tag(value)
    ORDER BY paths.key;
              """).substitute(release = release,
                              release_date = str(release_date),
                              open_api = json.dumps(open_api).replace("'","''"),
                              open_api_url = open_api_url)
try:
  plpy.execute((sql))
  return "{} open api is loaded".format(release)
except Exception as e:
  return "an error occurred: " + str(e) + "\nrelease: " + release
$$ LANGUAGE plpython3u ;
reset role;

comment on function load_open_api is 'loads given release to open_api table.  Pass release (as "X.XX.X") to load specific release, otherwise loads latest';

select 'load_open_api function defined and commented' as "build log";
