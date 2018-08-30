import json

from lib.models import *
from lib.parsers import *


# this is a bit silly given we have it locally but we'll run with it for now.


@db_session
def do_import(path, openapi_spec):
    log = load_audit_log(path)
    spec = load_openapi_spec(openapi_spec)
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

def usage_and_exit():
    print "Usage:"
    print "  import.py <audit_log_path> <branch_or_tag>"
    exit(1)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        usage_and_exit()
    branch_or_tag = sys.argv[2]
    openapi_uri = "https://raw.githubusercontent.com/kubernetes/kubernetes/%s/api/openapi-spec/swagger.json" % (branch_or_tag)
    do_import(sys.argv[1], openapi_uri)
