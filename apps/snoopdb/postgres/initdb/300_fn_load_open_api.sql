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

K8S_REPO_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/"
OPEN_API_PATH = "/api/openapi-spec/swagger.json"
#RELEASES_URL = "https://raw.githubusercontent.com/apisnoop/snoopDB/master/resources/coverage/releases.yaml"
# When refactored repo is merged
RELEASES_URL = 'https://raw.githubusercontent.com/cncf/apisnoop/master/resources/coverage/releases.yaml';

# Get info about latest release from our releases.yaml
releases = yaml.safe_load(urlopen(RELEASES_URL))
latest_release = releases[0]
latest_release_date = datetime.datetime.now()

release_dates = {
  "v1.0.0": "2015-07-10",
  "v1.1.0": "2015-11-09",
  "v1.2.0": "2016-03-16",
  "v1.3.0": "2016-07-01",
  "v1.4.0": "2016-09-26",
  "v1.5.0": "2016-12-12",
  "v1.6.0": "2017-03-28",
  "v1.7.0": "2017-06-30",
  "v1.8.0": "2017-08-28",
  "v1.9.0": "2017-12-15",
  "v1.10.0": "2018-03-26",
  "v1.11.0":  "2018-06-27",
  "v1.12.0": "2018-09-27",
  "v1.13.0": "2018-12-03" ,
  "v1.14.0": "2019-03-25",
  "v1.15.0": "2019-06-19",
  "v1.16.0": "2019-09-18",
  "v1.17.0": "2019-12-07",
  "v1.18.0": "2020-03-25",
  "v1.19.0": "2020-08-25",
  "v1.20.0": "2020-12-08"
}

# Set values for sql template  based on if custom_release argument was passed
if custom_release is not None:
  open_api_url = K8S_REPO_URL + custom_release + OPEN_API_PATH
# check to see if we can load this custom_release url
  try:
    open_api = json.loads(urlopen(open_api_url).read().decode('utf-8'))
    release = custom_release
    rd = release_dates[release]
    release_date = time.mktime(datetime.datetime.strptime(rd, "%Y-%m-%d").timetuple())
  except urllib.error.HTTPError as e:
    raise ValueError('http error with', e)
else:
  open_api_url = K8S_REPO_URL + 'master' + OPEN_API_PATH
  open_api = json.loads(urlopen(open_api_url).read().decode('utf-8'))
  release = latest_release
  release_date = time.mktime(datetime.datetime.now().timetuple())
sql = Template("""
   WITH open AS (
     SELECT '${open_api}'::jsonb as api_data)
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
     trim(leading 'v' from '${release}') as release,
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
                              release_date = release_date,
                              open_api = json.dumps(open_api).replace("'","''"),
                              open_api_url = open_api_url)
try:
  plpy.execute((sql))
  return "{} open api is loaded".format(release)
except Exception as e:
  return "an error occurred: " + e
$$ LANGUAGE plpython3u ;
reset role;

comment on function load_open_api is 'loads given release to open_api table.  Pass release (as "v.X.XX.X") to load specific release, otherwise loads latest';

select 'load_open_api function defined and commented' as "build log";
