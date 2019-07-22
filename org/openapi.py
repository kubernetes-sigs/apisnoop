import re
import json

# k8s appears to allow/expect a trailing {path} variable to capture everything
# remaining in the path, including '/' characters, which doesn't appear to be
# allowed according to the openapi 2.0 or 3.0 specs
# (ref: https://github.com/OAI/OpenAPI-Specification/issues/892)
K8S_PATH_VARIABLE_PATTERN = re.compile("{(path)}$")
VARIABLE_PATTERN = re.compile("{([^}]+)}")
def regex_from_path(path):
    # first replace the special trailing {path} wildcard with a named regex

    # path_regex = K8S_PATH_VARIABLE_PATTERN.sub("(?P<\\1>.+)", path).rstrip('/')
    # PosgresQL doesn't like named vars
    path_regex = K8S_PATH_VARIABLE_PATTERN.sub("(.*)", path).rstrip('/')
    # For SQL like, we just use %
    # path_regex = K8S_PATH_VARIABLE_PATTERN.sub("%", path).rstrip('/')
    # replace wildcards in {varname} format to a named regex
    # path_regex = VARIABLE_PATTERN.sub("(?P<\\1>[^/]+)", path_regex).rstrip('/')
    # if path != path_regex:
    #if '{' not in path:
    #  ipdb.set_trace(context=10)

    # now that we are using POSIX, we can't do {varname}
    path_regex = VARIABLE_PATTERN.sub("([^/]*)", path_regex).rstrip('/')
    # now that we are using LIKE, we just need %
    # path_regex = VARIABLE_PATTERN.sub("%", path_regex).rstrip('/')
    # ensure that everything ends looking for everything but '/'
    if not path_regex.endswith(")") and not path_regex.endswith("?"): # allow proxy to catch a trailing /
        path_regex += "([^/]*)"

    # # TODO(spiffxp): unsure if trailing / _should_ be counted toward /proxy
    if path_regex.endswith("proxy"): # allow proxy to catch a trailing /
        path_regex += "/?$"
    else:
        path_regex += "$"
    print('Converted path: %s into path_regex: %s' % (path, path_regex))
    return path_regex

LEVEL_PATTERN = re.compile("/v(?P<api_version>[0-9]+)(?:(?P<api_level>alpha|beta)(?P<api_level_version>[0-9]+))?")
def level_from_path(path):
    # get the level (alpha/beta/stable) and the version from the path
    level = None
    match = LEVEL_PATTERN.search(path)
    if match:
        level = match.groupdict().get("api_level")
    if level is None:
        level = "stable"
    return level

try:
    from urllib.parse import urlparse
except Exception as e:
    from urlparse import urlparse

def load_openapi_spec(url):
    if urlparse(url).scheme in ['http', 'https']:
        swagger = requests.get(url).json()
    else: # treat as file on disk
        with open(url, "rb") as f:
            swagger = json.load(f)

    openapi_spec = {}
    openapi_spec['operations'] = {}
    openapi_spec['parameters'] = {}
    openapi_spec['operation_list'] = []
    openapi_spec['parameter_list'] = []

    for path in swagger['paths']:
        path_regex = regex_from_path(path)
        for method, swagger_method in swagger['paths'][path].items():
            if method == "parameters":
                # List seems beter than dict since we are exporting to SQL
                for param in swagger_method:
                    param["path"]=path
                    openapi_spec['parameter_list'].append(param)
                params={}
                for param in swagger_method:
                    param_name = param['name']
                    del param['name']
                    params[param_name] = param
                openapi_spec['parameters'][path]=params
                continue
            if 'deprecated' in swagger_method.get('description', '').lower():
                # print('Skipping deprecated endpoint %s %s' % (method, path))
                continue
            if 'consumes' in swagger_method:
                # usually : ['application/json', 'application/yaml', 'application/vnd.kubernetes.protobuf']
                # or : ['*/*']
                # sometimes: ['application/json-patch+json', 'application/merge-patch+json',
                # 'application/strategic-merge-patch+json']
                pass
            if 'produces' in swagger_method:
                # usually : ['application/json', 'application/yaml', 'application/vnd.kubernetes.protobuf']
                # can additonally include:
                #   'application/json;stream=watch', 'application/vnd.kubernetes.protobuf;stream=watch']
                # is seldom: '*/*'
                # ['text/plain', 
                pass
            produces = swagger_method.get('produces', [])
            op_data = {}
            tags = sorted(swagger['paths'][path][method].get('tags', list()))
            if len(tags) > 0:
                op_data['tags'] = tags
                tag = tags[0]
                # just use one tag for category
                category = tag.split("_")[0]
                op_data['category'] = category
            else:
                op_data['category'] = ''
            op_id = swagger_method.get('operationId', '')
            op_data['description'] = swagger_method.get('description', '')
            group_version_kind = swagger_method.get('x-kubernetes-group-version-kind', {})
            op_data['group'] = group_version_kind.get('group', '')
            op_data['version'] = group_version_kind.get('version', '')
            op_data['kind'] = group_version_kind.get('kind', '')
            op_data['path'] = path
            op_data['path_regex'] = path_regex
            op_data['level'] = level_from_path(path)
            op_data['method'] = method
            openapi_spec['operations'][op_id]=op_data
            op_data['id'] = op_id
            openapi_spec['operation_list'].append(op_data)
            # openapi_spec['operations'][op_id] = op_data
    return openapi_spec

from typing import Iterator, Dict, Any, Optional
def clean_csv_value(value: Optional[Any]) -> str:
    if value is None:
        return r'\N'
    return str(value).replace('\n', '\\n')

import io

class StringIteratorIO(io.TextIOBase):

    def __init__(self, iter: Iterator[str]):
        self._iter = iter
        self._buff = ''

    def readable(self) -> bool:
        return True

    def _read1(self, n: Optional[int] = None) -> str:
        while not self._buff:
            try:
                self._buff = next(self._iter)
            except StopIteration:
                break
        ret = self._buff[:n]
        self._buff = self._buff[len(ret):]
        return ret

    def read(self, n: Optional[int] = None) -> str:
        line = []
        if n is None or n < 0:
            while True:
                m = self._read1()
                if not m:
                    break
                line.append(m)
        else:
            while n > 0:
                m = self._read1(n)
                if not m:
                    break
                n -= len(m)
                line.append(m)
        return ''.join(line)

def recreate_api_operations_table(cursor):
    cursor.execute(open('./hasura/migrations/20_table_api_operations.down.sql').read())
    # cursor.execute("CREATE TABLE public.audit_events (event jsonb);")
    cursor.execute(open('./hasura/migrations/20_table_api_operations.up.sql').read())
import ipdb
def openapi_operation_iterator(connection,
                         api_operations: Iterator[Dict[str, Any]],
                         size: int = 8192) -> None:
    with connection.cursor() as cursor:
        recreate_api_operations_table(cursor)

        audit_events_string_iterator = StringIteratorIO((
            '|'.join(map(clean_csv_value, (
                # ipdb.set_trace(context=10),
                # op["id"],
                op_id,
                op["method"],
                op["path"],
                op["path_regex"],
                op["group"],
                op["version"],
                op["kind"],
                op["category"],
                op["description"],
            ))) + '\n'
            for op_id,op in api_operations.items()
        ))

        cursor.copy_from(audit_events_string_iterator,
                         'api_operations',
                         sep='|', size=size)

# load_openapi_spec("~/go/src/k8s.io/kubernetes/api/openapi-spec/swagger.json")
