#!/usr/bin/python
import sys
import os
import re
import json

# python 2 and 3 provide urlparse in different modules
try:
    from urllib.parse import urlparse
except Exception as e:
    from urlparse import urlparse

from lib.parsers import load_openapi_spec, load_audit_log
from processArtifacts import file_to_json

def create_folders():
    for name in ['cache', 'output']:
        try:
            if not os.path.exists(name):
                # we get a race condition here
                os.makedirs(name)
        except Exception as e:
            pass


def generate_endpoints_tree(openapi_spec):
    # Base tests structure, without audit / test loaded

    endpoints = {}

    for endpoint in openapi_spec['paths'].values():
        for (method_name, method) in endpoint['methods'].items():
            method = endpoint['methods'][method_name]
            deprecated = re.match("[Dd]eprecated", method["description"])
            if deprecated:
                # import ipdb; ipdb.set_trace(context=60)
                continue

            op = method['operationId']
            if op not in endpoints.keys():
                endpoints[op] = {}

            endpoints[op][method_name] = {
                "category": method["category"],
                "description": method["description"],
                "group": method["group"],
                "kind": method["kind"],
                "version": method["version"],
                "path": endpoint['path'],
                "level": endpoint['level'],
                # "deprecated": deprecated,
                "counter": 0,
                "agents": [],
                "test_tags": [],
                "tests": []
            }

    return endpoints

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


def generate_coverage_report(openapi_spec, audit_log, user_agent_available):
    endpoints = generate_endpoints_tree(openapi_spec)
    tests = {}
    test_tags = {}
    test_sequences = {}
    useragents = {}
    unknown_urls = {}
    unknown_url_methods = {}
    for event in audit_log:
        spec_entry = find_openapi_entry(openapi_spec, event)
        uri = event['requestURI']
        method = event['method']
        useragent = event.get('userAgent', ' ')
        # look for the url in the OpenAPI spec
        if spec_entry is None:
            # print("API Entry not found for event URL \"%s\"" % \
            #   event['requestURI'])
            # openapi/v2 (kubectl)
            # /apis/scalingpolicy.kope.io/*/scalingpolcies
            # /apis/metrics.kope.io/*
            # /apis/extensions/*/replicationcontrollers
            if uri not in unknown_urls.keys():
                unknown_urls[uri] = {}
            if method not in unknown_urls[uri]:
                unknown_urls[uri][method] = {
                    'counter': 0,
                    'agents': []
                }
            if useragent and useragent not in unknown_urls[uri][method]['agents']:
                unknown_urls[uri][method]['agents'].append(useragent)
            unknown_urls[uri][method]['counter'] += 1
            continue
        # look for the url+method in the OpenAPI spec
        if method not in spec_entry['methods'].keys():
            # Mostly it's valid urls with /localsubjectaccesreviews appended
            # TODO: figure out what /localsubjectaccessreviews are
            # print("API Method %s not found for event URL \"%s\"" % (
                # event['method'],event['requestURI']))
            if uri not in unknown_url_methods.keys():
                unknown_url_methods[uri] = {}
            if method not in unknown_url_methods[uri]:
                unknown_url_methods[uri][method] = {
                    'counter': 0,
                    'agents': []
                }
            if useragent and useragent not in unknown_url_methods[uri][method]['agents']:
                unknown_url_methods[uri][method]['agents'].append(useragent)
            unknown_url_methods[uri][method]['counter'] += 1
            continue
        # We should now have level, category, path, and operationId
        op = spec_entry['methods'][method]['operationId']
        level = spec_entry.get('level')
        category = spec_entry['methods'][method]['category']
        path = spec_entry['path']
        if event.get('userAgent', False) and useragent.startswith('e2e.test'):
            test_name_start = ' -- '
            if useragent.find(test_name_start) > -1:
                test_name = useragent.split(test_name_start)[1]
                if test_name not in tests.keys():
                    tests[test_name] = {}
                if test_name not in test_sequences.keys():
                    test_sequences[test_name] = []
                test_sequences[test_name].append([event['requestReceivedTimestamp'],
                                                  level, category, method, op])
                if op not in tests[test_name].keys():
                    tests[test_name][op] = {}
                if method not in tests[test_name][op].keys():
                    tests[test_name][op][method] = {
                        "counter": 0
                    }
                tests[test_name][op][method]["counter"] += 1
                tags = re.findall(r'\[.+?\]', test_name)
                for tag in tags:
                    if tag not in test_tags.keys():
                        test_tags[tag] = {}
                    if op not in test_tags[tag].keys():
                        test_tags[tag][op] = {}
                    if method not in test_tags[tag][op].keys():
                        test_tags[tag][op][method] = {
                            "counter": 0
                        }
                    test_tags[tag][op][method]["counter"] += 1
                    if tag not in endpoints[op][method]['test_tags']:
                        endpoints[op][method]['test_tags'].append(tag)
                    if test_name not in endpoints[op][method]['tests']:
                        endpoints[op][method]['tests'].append(test_name)
                    # if tag not in sb_method['test_tags']:
                    #     sb_method['test_tags'].append(tag)

        else:
            # IF we hit here, this is NOT an e2e.test user agent
            if user_agent_available: # 12 and higher
              pass # go on to user agent processing (e2e only)
              # continue # do no further processing (e2e + other)
            else: # 11 and lower
              # Only look at e2e for now, skip anything else
              # Let's look into dropping support for 11 and lower
              pass #(log everything)
              # continue # stop here

        # TODO: this does NOT mean tested, this means hit
        # This is a remnant of 11 and lower not having tests in user agent
        endpoints[op][method]["counter"] += 1
        agent = event.get('userAgent', ' ').split(' ')[0]
        if agent not in useragents.keys():
            useragents[agent] = {}
        if op not in useragents[agent].keys():
            useragents[agent][op] = {}
        if method not in useragents[agent][op].keys():
            useragents[agent][op][method] = {
                "counter": 0
            }
        useragents[agent][op][method]["counter"] += 1
        if agent not in endpoints[op][method]['agents']:
            endpoints[op][method]['agents'].append(agent)

    report = {}
    report['endpoints'] = endpoints
    report['tests'] = tests
    report['test_tags'] = test_tags
    report['test_sequences'] = test_sequences
    report['useragents'] = useragents
    report['unknown_urls'] = unknown_urls
    report['unknown_url_methods'] = unknown_url_methods
    return report


def usage_and_exit():
    print("Usage:")
    print("  process-audit.py <auditfile> <branch_or_tag> <outfile>")
    print("    - Process audit file for use with webui")
    exit(1)


def main():
    if len(sys.argv) < 4:
        usage_and_exit()
    # create folder structure on disk
    create_folders()

    filename = sys.argv[1]
    if not os.path.isfile(filename):
        print("Invalid filename given")
        usage_and_exit()
    auditpath = os.path.dirname(filename)
    metadata = file_to_json(auditpath + '/artifacts/metadata.json')
    finished = file_to_json(auditpath + '/finished.json')
    semver = finished['version'].split('v')[1].split('-')[0]
    major = semver.split('.')[0]
    minor = semver.split('.')[1]

    # TODO: some better logic for retreiving the openapi spec to load
    # We could look at the audit_log, rather than requiring it on the cli
    branch_or_tag = sys.argv[2]
    openapi_uri = "https://raw.githubusercontent.com/kubernetes/kubernetes/%s/api/openapi-spec/swagger.json" % (branch_or_tag)

    openapi_spec = load_openapi_spec(openapi_uri)
    audit_log = load_audit_log(filename)

    user_agent_available = True
    if int(minor) < 12:
        user_agent_available = False
    report = generate_coverage_report(openapi_spec, audit_log, user_agent_available)

    output_path = sys.argv[3]
    open(output_path, 'w').write(
        json.dumps(report))
    return  # we are done

if __name__ == "__main__":
    main()
