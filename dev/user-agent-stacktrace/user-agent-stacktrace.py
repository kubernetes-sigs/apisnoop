import os
import sys
import json
import re

from urlparse import urlparse
from lib.parsers import *
OPENAPI_SPEC_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json"

def find_openapi_entry(openapi_spec, event):
    url = urlparse(event['requestURI'])
    hit_cache = openapi_spec['hit_cache']
    prefix_cache = openapi_spec['prefix_cache']
    # 1) Cached seen before results
    if url.path in hit_cache:
        return hit_cache[url.path]
    # 2) Indexed by prefix patterns to cut down search time
    for prefix in prefix_cache:
        if prefix is not None and url.path.startswith(prefix):
            # print prefix, url.path
            paths = prefix_cache[prefix]
            break
    else:
        paths = prefix_cache[None]

    for regex in paths:
        if re.match(regex, url.path):
            hit_cache[url.path] = openapi_spec['paths'][regex]
            return openapi_spec['paths'][regex]
        elif re.search(regex, event['requestURI']):
            print("Incomplete match", regex, event['requestURI'])
    # cache failures too
    hit_cache[url.path] = None
    return None

def main():
    openapi_spec = load_openapi_spec(OPENAPI_SPEC_URL)
    with open(sys.argv[1], "rb") as auditlogfile:
        for auditentry in auditlogfile:
            event = json.loads(auditentry)
            useragent = event['userAgent']
            verb = event['verb']
            requesturi = event['requestURI']
            spec_entry = find_openapi_entry(openapi_spec, event)
            unknown_urls = []
            unknown_url_methods = []
            if spec_entry is None:
                print("Entry not found for event URL \"%s\"" % event['requestURI'])
                unknown_urls += [event['requestURI']]
                continue
            try:
                print spec_entry['path']
            except Exception as e:
                print event
                unknown_url_methods += [(event['requestURI'], event['verb'])]
                # unknown_url_methods += [(event['requestURI'], event['method'], event['verb'])]
                continue
            if not "stacktrace=" in useragent:
                continue
            # import ipdb; ipdb.set_trace()
            user_agent = useragent.split("stacktrace=[")[0]
            prog, platform, ver = useragent.split(' ')[0:3]
            text = useragent.split("stacktrace=[", 1)[1].rsplit("]", 1)[0]
            lines = text.split(";")
            backtrace = []
            for line in lines:
                if line.startswith("()"):
                    continue
                backtrace.append(line.split(":"))
                function_stack = []
                fileline_stack = []
                for function, filepath, lineno in backtrace:
                    function = re.sub(r'^/','',
                                      re.sub(r'^.*go/src','', # strip go/src
                                             re.sub(r'^.*/vendor/','', # strip vendor
                                            function))) # we only want the function
                    filepath = re.sub(r'^/','', # strip leading /
                                      re.sub(r'^.*go/src','', # strip go/src
                                             re.sub(r'^.*/vendor/','', # strip vendor
                                                    filepath)))
                    fileline_stack.append("%s:%s" % (filepath, lineno))
                    function_stack.append("%s" % function)
            print prog, ver
            print verb, requesturi
            for fileline in fileline_stack:
                print "  src %s" % fileline
            for function in function_stack:
                print "  fun %s" % function

if __name__ == "__main__":
    main()
