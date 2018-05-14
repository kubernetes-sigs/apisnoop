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

# https://github.com/kubernetes/kubernetes/pull/50627/files


OPENAPI_SPEC_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/v1.9.6/api/openapi-spec/swagger.json"

# inputs
# audit log
# swagger json defs
#

def create_folders():
    for name in ['cache', 'output']:
        if not os.path.exists(name):
            os.mkdir(name)


def generate_count_tree(openapi_spec):
    count_tree = {}

    for endpoint in openapi_spec['paths'].values():
        path = endpoint['path']
        count_tree[path] = {
            "counter": 0,
            "methods": {},
            "level": endpoint.get("level")
        }
        for method in endpoint['methods']:
            count_tree[path]['methods'][method] = {
                "counter": 0,
                "fields": {},
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

def count_event(count_tree, event, spec_entry):
    path = spec_entry['path']
    method = event['method']
    count_tree[path]['counter'] += 1
    try:
        count_tree[path]['methods'][method]['counter'] += 1
    except:
        print method, event['requestURI'], path, count_tree[path]['methods'].keys(), event['verb']
        raise

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

    return sorted(results, key=lambda x: (-x['count'], x['level'], x['url'], x['method']))

def generate_coverage_report(openapi_spec, audit_log):
    count_tree = generate_count_tree(openapi_spec)
    event_summary = []
    unknown_urls = []
    unknown_url_methods = []
    for event in audit_log:
        spec_entry = find_openapi_entry(openapi_spec, event)
        if spec_entry is None:
            print("Entry not found for event URL \"%s\"" % event['requestURI'])
            unknown_urls += [event['requestURI']]
            continue
        try:
            count_event(count_tree, event, spec_entry)
        except:
            unknown_url_methods += [(event['requestURI'], event['method'], event['verb'])]
            continue
        # event_summary.append([
        #     event['timestamp'],
        #     event['requestURI'],
        #     spec_entry['path'],
        #     event['method'],
        #     spec_entry.get('level'),
        #     ", ".join(event.get('sourceIPs', []))])

    report = {}
    report['results'] = get_count_results(count_tree)
    report['unknown_urls'] = sorted(unknown_urls)
    # generate some simple statistics
    statistics = {
        'total': {
            'hit': 0,
            'total': 0
        }
    }

    for level in ['alpha', 'beta', 'stable']:
        statistics[level] = {
            'hit': len(filter(lambda x: x['level'] == level and x['count'] > 0, report['results'])),
            'total': len(filter(lambda x: x['level'] == level, report['results']))
        }
        statistics['total']['hit'] += statistics[level]['hit']
        statistics['total']['total'] += statistics[level]['total']

    report['statistics'] = statistics

    report['unknown_methods'] = set([" | ".join(x) for x in unknown_url_methods])

    return report

def usage_and_exit():
    print "Usage:"
    print "  logreview.py help"
    print "    - Show this message."
    print "  logreview.py load-coverage <filename>"
    print "    - Load Google Docs test coverage spreadsheet from CSV."
    print "  logreview.py load-audit <filename> <appname>"
    print "    - Load Kubernetes audit log for app into database."
    print "  logreview.py remove-audit <appname>"
    print "    - Delete Kubernetes audit log for app from database."
    print "  logreview.py export-data <exporter-name> <output-filename> <appname (optional)>"
    print "    - Export audit log information from database as CSV files."
    print "    - Available exporters: " + ", ".join(exports.list_exports())
    print "  logreview.py start-server"
    print "    - Start web server to display data visualisations."
    exit(1)


def main():
    ## Commands

    ## load-coverage [filename] -- loads extract from google spreadsheet
    ## load-audit [filename] [app] -- loads an audit log under the name of app
    ## generate-report [output-filename] -- outputs the details to a file

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
        return # we are done
    elif sys.argv[1] == 'load-audit':
        if len(sys.argv) < 4:
            usage_and_exit()
        filename = sys.argv[2]
        if not os.path.isfile(filename):
            print "Invalid filename given"
            usage_and_exit()
        appname = sys.argv[3]
        openapi_spec = load_openapi_spec(OPENAPI_SPEC_URL)
        audit_log = load_audit_log(filename)
        report = generate_coverage_report(openapi_spec, audit_log)
        App.update_from_results(appname, report['results'])
        return # we are done
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
        print "Webserver not implemented"
        return
if __name__ == "__main__":
    main()
