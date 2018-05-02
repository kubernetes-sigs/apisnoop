
import re
import json


from urlparse import urlparse
from collections import defaultdict

__all__ = ['load_openapi_spec', 'load_audit_log']


def load_openapi_spec(url):
    try:
        openapi_spec = {}
        url_parsed = urlparse(url)
        if url_parsed.scheme in ['http', 'https']:
            swagger = requests.get(url).json()
        else: # if url_parsed.scheme == ''
            # treat as file on disk
            with open(url, "rb") as f:
                swagger = json.load(f)

        # swagger will now contain json

        openapi_spec['paths'] = {}
        openapi_spec['prefix_cache'] = defaultdict(dict)
        openapi_spec['hit_cache'] = {}
        for path in swagger['paths']:
            # replace wildcards in {varname} format to a named regex
            path_regex = re.sub("{([^}]+)}", "(?P<\\1>[^/]+)", path).rstrip('/')
            if path_regex.endswith("proxy"):
                path_regex += ".*$"
            else:
                path_regex += "$"
            # use the path regex as the key so that we search for a match easily
            openapi_spec['paths'][path_regex] = {}
            openapi_spec['paths'][path_regex]['path'] = path
            # get the level (alpha/beta/stable) and the version from the path
            m = re.search("/v(?P<api_version>[0-9]+)(?:(?P<api_level>alpha|beta)(?P<api_level_version>[0-9]+))?", path)
            if m:
                extract = m.groupdict()

                level = extract.get("api_level")
                if level is None:
                    level = "stable"
                openapi_spec['paths'][path_regex]['level'] = level
                openapi_spec['paths'][path_regex]['version'] = extract["api_version"]
            else:
                level = "stable"
                openapi_spec['paths'][path_regex]['level'] = level
            # methods
            openapi_spec['paths'][path_regex]['methods'] = {}
            methods = swagger['paths'][path].keys()
            for method in methods:
                if method == "parameters":
                    continue
                openapi_spec['paths'][path_regex]['methods'][method] = {}
                openapi_spec['paths'][path_regex]['methods'][method]['tags'] = sorted(swagger['paths'][path][method].get('tags', list()))
                # todo - request + response

            # crazy caching using prefixes
            bits = path.strip("/").split("/", 2)
            if bits[0] in ["apis", "api"] and len(bits) > 1:
                openapi_spec['prefix_cache']["/" + "/".join(bits[0:2])][path_regex] = openapi_spec['paths'][path_regex]
            else:
                openapi_spec['prefix_cache'][None][path_regex] = openapi_spec['paths'][path_regex]
            # print path, path_regex, re.match(path_regex, path.rstrip('/')) is not None
        return openapi_spec

    except Exception as e:
        print("Failed to load openapi spec \"%s\"" % url)
        raise e

def load_audit_log(path):
    audit_log = []
    with open(path, "rb") as logfile:
        for entry in logfile:
            raw_event = json.loads(entry)
            # change verb to represent http request
            verb_tt = {
                'get': ['get', 'list', 'watch', 'proxy'],
                'put': ['update', 'patch'],
                'post': ['create'],
                'delete': ['delete', 'deletecollection']
            }

            for method, verbs in verb_tt.items():
                if raw_event['verb'] in verbs:
                    raw_event['method'] = method
                    break
            if "method" not in raw_event:
                print("Error parsing event - HTTP method map not defined at \"%s\" for verb \"%s\"" % (raw_event['requestURI'], raw_event['verb']))

            audit_log.append(raw_event)
    return audit_log
