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

    print 'Loading endpoints parsed from openapi spec into database...'
    for endpoint in spec['paths'].values():
        path = endpoint['path']
        for method, metadata in endpoint['methods'].items():
            print 'Loading endpoint %s %s' % (method, path)
            endpoints[path, method] = Endpoint(method=method, url=path, level=endpoint.get('level'),
                                               category=metadata['category'])

    print 'Matching events parsed from audit log with openapi endpoints stored in database...'
    hits = {}
    for event in log:
        endpoint = find_openapi_entry(spec, event)
        if endpoint is None:
            print 'No openapi endpoint found for event: %s %s' % (event['method'], event['requestURI'])
            continue
        try:
            path = endpoint['path']
            method = event['method']
        except Exception as e:
            print("Even more surprising result!", endpoint, event)

        if (path, method) not in endpoints:
            print 'Ignoring event for unknown endpoint: %s %s' % (method, path)
            continue
        #else:
        #   print 'Found endpoint: %s %s for event: %s %s' % (method, path, event['method'], event['requestURI'])

        user_agent = event.get('userAgent', 'unknown')
        # kubernetes e2e.test incluse test case name in its user agent
        # TODO(spiffxp): this throws off the total number of hits because now
        #                we're counting twice for e2e.test and the test case
        #                name
        uas = [user_agent.split(' ', 1)[0]]
        if "e2e.test" in user_agent and "--" in user_agent:
            uas.append(user_agent.split("--")[1].strip())
        for ua in uas:
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
