import json

from lib.models import *
from lib.parsers import *


# this is a bit silly given we have it locally but we'll run with it for now.
OPENAPI_SPEC_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json"


@db_session
def do_import(path):
    log = load_audit_log(path)
    spec = load_openapi_spec(OPENAPI_SPEC_URL)
    endpoints = {}

    # we need to have an entry for everything in the spec, including entries
    # that we never use (especially including those, or we'd always have 100%
    # coverage).

    for endpoint in spec['paths'].values():
        path = endpoint['path']
        print(endpoint)
        for method, metadata in endpoint['methods'].items():
            print(path, method)
            endpoints[path, method] = Endpoint(method=method, url=path, level=endpoint.get('level'),
                                               category=metadata['category'])

    hits = {}
    for event in log:
        endpoint = find_openapi_entry(spec, event)
        if endpoint is None:
            print("Missing endpoint...")
            continue
        path = endpoint['path']
        method = event['method']

        if(path, method) not in endpoints:
            print("Surprising result!", path, method)
            continue

        ua = event.get('userAgent', 'unknown').split(' ', 1)[0]
        t = (path, method, ua)
        if t in hits:
            hits[t].count += 1
        else:
            hits[t] = EndpointHit(endpoint=endpoints[path, method], user_agent=ua, count=1)
    commit()


if __name__ == '__main__':
    import sys
    do_import(sys.argv[1])