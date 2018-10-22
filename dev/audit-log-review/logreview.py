#!/usr/bin/python

import sys
import os
import glob
import re
import json
import sqlite3
import csv

from urlparse import urlparse
from collections import defaultdict
from pprint import pprint


from lib.webserver import start_webserver
from lib.models import *
from lib.parsers import *
from lib import exports


def create_folders():
    for name in ['cache', 'output']:
        if not os.path.exists(name):
            os.mkdir(name)


def generate_sunburst_tree(openapi_spec):
    # Base sunburst structure, without audit / test loaded

    sunburst = {}

    for endpoint in openapi_spec['paths'].values():

        level = endpoint.get('level')
        if level not in sunburst.keys():
            sunburst[level] = {
            }

        for method_name in endpoint['methods'].keys():
            method = endpoint['methods'][method_name]
            category = method['category']

            if category not in sunburst[level].keys():
                sunburst[level][category] = {
                }

            path = endpoint['path']
            if path not in sunburst[level][category].keys():
                sunburst[level][category][path] = {
                }

            sunburst[level][category][path][method_name] = {
                "description": method['description'],
                "operationId": method['operationId'],
                "counter": 0,
                "agents": [],
                "tests": [],
                "test_tags": []
            }

            # import ipdb; ipdb.set_trace(context=60)

    return sunburst

def generate_count_tree(openapi_spec):
    count_tree = {}

    for endpoint in openapi_spec['paths'].values():
        path = endpoint['path']
        count_tree[path] = {
            "counter": 0,
            "methods": {},
            "misses": {},
            "level": endpoint.get("level")
        }
        for method in endpoint['methods']:
            count_tree[path]['methods'][method] = {
                "counter": 0,
                "fields": {},
                "agents": [],
                "tests": [],
                "test_tags": [],
                "tags": endpoint['methods'][method]['tags'],
                "category": endpoint['methods'][method]['category']
            }

    return count_tree


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


def sunburst_event(sunburst, event, spec_entry):
    path = spec_entry['path']
    level = spec_entry.get('level')
    method = event['method']
    useragent = event.get('userAgent', ' ')
    test_name_start = ' -- '
    agent = useragent.split(' ')[0]

    # Check to see if the method is avaliable at this path
    # some are not
    if method not in spec_entry['methods'].keys():
        # import ipdb; ipdb.set_trace(context=60)
        # TODO: we should do something with calls that don't hit the API Spec
        return
    #count_type = 'methods'
    # count_type = 'misses'
    # if method not in sunburst[path]['misses']:
    #     sunburst[path]['misses'][method] = {
    #         'counter': 0, 'agents': [], 'tests': []
    #     }

    category = spec_entry['methods'][method]['category']
    sunburst[level][category][path][method]['counter'] += 1

    if agent not in sunburst[level][category][path][method]['agents']:
        sunburst[level][category][path][method]['agents'].append(agent)

    if 'e2e.test' in useragent and test_name_start in useragent:
        test_name = useragent.split(test_name_start)[1]
        test_tags = re.findall(r'\[.+?\]', test_name)
        if test_name not in sunburst[level][category][path][method]['tests']:
            sunburst[level][category][path][method]['tests'].append(test_name)
        for tag in test_tags:
            if tag not in sunburst[level][category][path][method]['test_tags']:
                sunburst[level][category][path][method]['test_tags'].append(tag)

def count_event(count_tree, event, spec_entry):
    path = spec_entry['path']
    method = event['method']
    useragent = event.get('userAgent', ' ')
    agent = useragent.split(' ')[0]
    test_name_start = ' -- '
    count_type = 'methods'

    count_tree[path]['counter'] += 1

    if method not in count_tree[path]['methods']:
        count_type = 'misses'
        if method not in count_tree[path]['misses']:
            count_tree[path]['misses'][method] = {
                'counter': 0, 'agents': [], 'tests': []
            }
    count_tree[path][count_type][method]['counter'] += 1

    if agent not in count_tree[path][count_type][method]['agents']:
        count_tree[path][count_type][method]['agents'].append(agent)

    if 'e2e.test' in useragent:
        if test_name_start in useragent:
            test_name = useragent.split(test_name_start)[1]
            test_tags = re.findall(r'\[.+?\]', test_name)
        else:
            test_name = 'none given'
        if test_name not in count_tree[path][count_type][method]['tests']:
            count_tree[path][count_type][method]['tests'].append(
                test_name)
        for tag in test_tags:
            if tag not in count_tree[path][count_type][method]['test_tags']:
                count_tree[path][count_type][method]['tests_tags'].append(tag)

def test_event(test_tree, event, spec_entry):
    path = spec_entry['path']
    useragent = event['userAgent']
    test_name_start = ' -- '

    if useragent.find(test_name_start) > -1:
        test_name = useragent.split(test_name_start)[1]
        test_tags = re.findall(r'\[.+?\]', test_name)
        for tag in test_tags:
            if tag not in test_tree['tags']:
                test_tree['tags'].append(tag)
        if test_name not in test_tree['tests'].keys():
            test_tree['tests'][test_name] = {
                'paths': {}
            }
        if path not in test_tree['tests'][test_name]['paths'].keys():
            test_tree['tests'][test_name]['paths'][path] = {
                'counter': 1
            }
        else:
            test_tree['tests'][test_name]['paths'][path]['counter'] += 1


def get_count_results(count_tree):
    results = []

    for url, url_data in count_tree.items():
        for method, method_data in url_data['methods'].items():
            results += [{
                'url': url,
                'method': method,
                'level': url_data['level'],
                'tags': ','.join(method_data['tags']),
                'category': method_data['category'],
                'count': method_data['counter']
            }]

    r = sorted(results,
               key=lambda x: (-x['count'], x['level'], x['url'], x['method']))
    return r


def generate_coverage_report(openapi_spec, audit_log):
    sunburst = generate_sunburst_tree(openapi_spec)
    # count_tree = generate_count_tree(openapi_spec)
    # test_tree = {'tests': {}, 'tags': []}
    event_summary = []
    unknown_urls = {}
    unknown_url_methods = {}
    for event in audit_log:
        spec_entry = find_openapi_entry(openapi_spec, event)
        uri = event['requestURI']
        method = event['method']
        useragent = event.get('userAgent', ' ')
        # look for the url in the OpenAPI spec
        if spec_entry is None:
            # print("API Entry not found for event URL \"%s\"" % event['requestURI'])
            # openapi/v2 (kubectl)
            # /apis/scalingpolicy.kope.io/*/scalingpolcies
            # /apis/metrics.kope.io/*
            # /apis/extensions/*/replicationcontrollers
            if uri not in unknown_urls.keys():
                unknown_urls[uri] = {}
            if method not in unknown_urls[uri]:
                unknown_urls[uri][method] = {
                    'count': 0,
                    'agents': []
                }
            if useragent and useragent not in unknown_urls[uri][method]['agents']:
                unknown_urls[uri][method]['agents'].append(useragent)
            unknown_urls[uri][method]['count'] += 1
            continue
        # look for the url+method in the OpenAPI spec
        if event['method'] not in spec_entry['methods'].keys():
            # Mostly it's valid urls with /localsubjectaccesreviews appended
            # TODO: figure out what /localsubjectaccessreviews are
            # print("API Method %s not found for event URL \"%s\"" % (
                # event['method'],event['requestURI']))
            if uri not in unknown_url_methods.keys():
                unknown_url_methods[uri] = {}
            if method not in unknown_url_methods[uri]:
                unknown_url_methods[uri][method] = {
                    'count': 0,
                    'agents': []
                }
            if useragent and useragent not in unknown_url_methods[uri][method]['agents']:
                unknown_url_methods[uri][method]['agents'].append(useragent)
            unknown_url_methods[uri][method]['count'] += 1
            continue
        # Should be available in for sunburst
        sunburst_event(sunburst, event, spec_entry)
        # if event['userAgent'] and event['userAgent'].startswith('e2e.test'):
            # test_event(test_tree, event, spec_entry)
        # try:
        #     count_event(count_tree, event, spec_entry)
        # except Exception:
        #     unknown_url_methods += [(event['requestURI'],
        #                              event['method'],
        #                              event['verb'])]
    #     import ipdb; ipdb.set_trace(context=60)
    # event_summary.append([
    #     event['timestamp'],
    #     event['requestURI'],
    #     spec_entry['path'],
    #     event['method'],
    #     spec_entry.get('level'),
    #     ", ".join(event.get('sourceIPs', []))])

    report = {}
    # report['results'] = get_count_results(count_tree)
    report['sunburst'] = sunburst
    # import ipdb; ipdb.set_trace(context=60)
    # report['tree'] = sunburst
    # report['unknown_urls'] = unknown_urls
    # report['unknown_url_methods'] = unknown_url_methods
    # generate some simple statistics
    # statistics = {
    #     'total': {
    #         'hit': 0,
    #         'total': 0
    #     }
    # }

    # for level in ['alpha', 'beta', 'stable']:
    #     statistics[level] = {
    #         'hit': len(
    #             filter(lambda x: x['level'] == level and x['count'] > 0,
    #                    report['results'])),
    #         'total': len(
    #             filter(lambda x: x['level'] == level,
    #                    report['results']))
    #     }
    #     statistics['total']['hit'] += statistics[level]['hit']
    #     statistics['total']['total'] += statistics[level]['total']

    # report['count'] = count_tree
    # report['test'] = test_tree
    # report['statistics'] = statistics

    # report['unknown_methods'] = list(
    #     set([" | ".join(x) for x in unknown_url_methods]))

    return report


def usage_and_exit():
    print "Usage:"
    print "  logreview.py help"
    print "    - Show this message."
    print "  logreview.py load-coverage <filename>"
    print "    - Load Google Docs test coverage spreadsheet from CSV."
    print "  logreview.py process-audit <audit-filename> <branch_or_tag> <output-jsonfile>"
    print "    - Load audit log with openapi spec from branch or tag for app into jsonfile."
    print "  logreview.py load-audit <filename> <branch_or_tag> <appname>"
    print "    - Load audit log with openapi spec from branch or tag for app into database."
    print "  logreview.py remove-audit <appname>"
    print "    - Delete Kubernetes audit log for app from database."
    print "  logreview.py export-data <exporter-name> <output-filename> <appname (optional)>"
    print "    - Export audit log information from database as CSV files."
    print "    - Available exporters: " + ", ".join(exports.list_exports())
    print "  logreview.py start-server"
    print "    - Start web server to display data visualisations."
    exit(1)


def main():
    # Commands

    # load-coverage [filename] -- loads extract from google spreadsheet
    # load-audit [filename] [app] -- loads an audit log under the name of app
    # generate-report [output-filename] -- outputs the details to a file

    if len(sys.argv) < 2:
        usage_and_exit()
    # create folder structure on disk
    create_folders()

    # process
    if sys.argv[1] == 'help':
        usage_and_exit()
    elif sys.argv[1] == 'load-coverage':
        if len(sys.argv) < 3:
            usage_and_exit()
        filename = sys.argv[2]
        if not os.path.isfile(filename):
            print "Invalid filename given"
            usage_and_exit()
        rows = load_coverage_csv(filename)
        Endpoint.update_from_coverage(rows)
        return  # we are done

    elif sys.argv[1] == 'process-audit':
        if len(sys.argv) < 5:
            usage_and_exit()
        filename = sys.argv[2]
        if not os.path.isfile(filename):
            print "Invalid filename given"
            usage_and_exit()
        branch_or_tag = sys.argv[3]
        openapi_uri = "https://raw.githubusercontent.com/kubernetes/kubernetes/%s/api/openapi-spec/swagger.json" % (branch_or_tag)
        appname = sys.argv[4]
        openapi_spec = load_openapi_spec(openapi_uri)
        audit_log = load_audit_log(filename)
        report = generate_coverage_report(openapi_spec, audit_log)
        # import ipdb; ipdb.set_trace(context=60)
        # App.update_from_results(appname, report['results'])
        # write json next to logfile
        output_path = sys.argv[4]
        open(output_path, 'w').write(
            json.dumps(report))
        return  # we are done

    elif sys.argv[1] == 'export-data':
        if len(sys.argv) < 4:
            usage_and_exit()
        exporter_name = sys.argv[2]
        output_path = sys.argv[3]
        other_args = sys.argv[4:]
        try:
            exports.export_data(exporter_name, output_path, *other_args)
            print "Exported to %s successfully" % output_path
        except Exception as e:
            print e.message
            raise
        return

    elif sys.argv[1] == 'remove-audit':
        if len(sys.argv) < 3:
            usage_and_exit
        appname = sys.argv[2]
        found = App.remove_from_db(appname)
        if not found:
            print "%s does not exist" % appname
            exit(1)
        else:
            print "%s deleted" % appname
        return

    elif sys.argv[1] == 'start-server':
        start_webserver()
        return


if __name__ == "__main__":
    main()
