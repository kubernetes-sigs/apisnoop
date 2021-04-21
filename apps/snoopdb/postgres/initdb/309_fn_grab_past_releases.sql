create function grab_past_releases ()
returns setof text
language plpython3u as $$

import json
import yaml
from urllib.request import urlopen, urlretrieve

def has_open_api (version):
    major = version.split('.')[1]
    return int(major) >= 5 # open api wasn't established until 1.5.0

RELEASES_URL = 'https://raw.githubusercontent.com/cncf/apisnoop/main/resources/coverage/releases.yaml'
past_releases = yaml.safe_load(urlopen(RELEASES_URL))[1:]
versions_with_openapi = [release["version"] for release in past_releases if has_open_api(release["version"])]
return versions_with_openapi
$$;

comment on function grab_past_releases is 'return list of versions (X.XX.X) that aren't latest and have a swagger.json';

select 'grab_past_releases function defined and commented' as "build log";
