
import csv
from collections import defaultdict

from .models import *

def export_data(export_name, export_path, *args):
    # basic filtering on app name
    if len(args) > 0:
        app_name = args[0]
    else:
        app_name = None

    print(app_name)

    if export_name not in exports:
        raise Exception("Export not found: %s" % export_name)
    else:
        exporter = exports[export_name]
        return exporter(export_path, app_name)

@db_session
def app_usage_categories_csv(export_path, app_name=None):
    headers = ["app", "level", "category", "count"]
    results = []
    for app in App.select(lambda x: app_name is None or x.name == app_name):
        hits = EndpointHit.select(lambda hit: hit.app == app and hit.count > 0)
        stats = defaultdict(lambda: defaultdict(int))
        for hit in hits:
            endpoint = hit.endpoint
            stats[endpoint.level][endpoint.category] += 1
        for level in stats:
            for category, count in stats[level].items():
                results += [[app.name, level, category, count]]

    results = sorted(results, key=lambda x: (x[0], -x[-1], x[1], x[2]))
    with open(export_path, "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)


@db_session
def app_usage_endpoints_csv(export_path, app_name=None):
    results = []
    apps = App.select(lambda x: app_name is None or x.name == app_name).order_by(App.name)

    hits = select((hit.endpoint, count()) for hit in EndpointHit if hit.app in apps and hit.count > 0)
    misses = select((hit.endpoint.level, hit.endpoint.category, count()) for hit in EndpointHit if hit.app in apps and hit.count == 0)

    # sort everything here
    order_level = defaultdict(int)
    for level, hitcount in select((hit.endpoint.level, count()) for hit in EndpointHit if hit.app in apps and hit.count > 0):
        order_level[level] = hitcount
    order_level_category = defaultdict(lambda: defaultdict(int))
    for level, category, hitcount in select((hit.endpoint.level, hit.endpoint.category, count()) for hit in EndpointHit if hit.app in apps and hit.count > 0):
        order_level_category[level][category] = hitcount

    def sort_hits_fn(row):
        endpoint, hitcount = row
        return (
            -order_level[endpoint.level],
            -order_level_category[endpoint.level][endpoint.category],
            -hitcount,
            endpoint.url,
            endpoint.method)

    hits = sorted(hits, key=sort_hits_fn)

    with open(export_path, 'wb') as f:
        writer = csv.writer(f)

        headers = ['level', 'category', 'method + url', 'count']
        writer.writerow(headers)
        for endpoint, count in hits:
            category = endpoint.category
            if category == '':
                category = "uncategorized"
            writer.writerow([endpoint.level, category, endpoint.method + " " + endpoint.url, count])
        for level, category, count in misses:
            if category == '':
                category = "uncategorized"
            writer.writerow([level, category, "unused", count])


@db_session
def coverage_spreadsheet_csv(export_path, *args):
    results = []
    apps = App.select(lambda x: True).order_by(App.name)
    endpoints = Endpoint.select(lambda x: True).order_by(Endpoint.level, Endpoint.url, Endpoint.method)

    headers = ['level', 'category', 'method', 'url', 'conforms', 'apps using it']
    for app in apps:
        headers += [app.name]
    headers += ['questions']

    for endpoint in endpoints:
        counts = []
        hits = []
        for app in apps:
            hit = EndpointHit.get(endpoint=endpoint, app=app)
            if hit is not None:
                count = hit.count
            else:
                count = 0
            counts.append(count)
        # Create the result row
        result = [endpoint.level, endpoint.category, endpoint.method, endpoint.url, endpoint.conforms]
        apps_using = len(filter(lambda x: x > 0, counts))
        result += [apps_using]
        result += counts
        result += [endpoint.questions]
        # Add the row to the result list
        results += [result]

    idx_using = 5
    idx_method = 2
    idx_url = 3
    idx_level = 0
    idx_category = 1

    results = sorted(results, key=lambda x: (-x[idx_using]))

    with open(export_path, "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)

@db_session
def app_usage_summary_csv(export_path, app_name=None):
    headers = ["app", "stable", "beta", "alpha", "total", "conformance"]
    results = []
    for app in App.select(lambda x: app_name is None or x.name == app_name).order_by(App.name):
        hits = EndpointHit.select(lambda hit: hit.app == app and hit.count > 0)
        stats = defaultdict(lambda: defaultdict(int))
        for hit in hits:
            endpoint = hit.endpoint
            stats[endpoint.level][endpoint.category] += 1

        alphasum = sum(stats['alpha'].values())
        betasum = sum(stats['beta'].values())
        stablesum = sum(stats['stable'].values())
        level = "stable"
        if betasum > 0:
            level = "beta"
        if alphasum > 0:
            level = "alpha"
        total = alphasum + betasum + stablesum
        results += [[app.name, stablesum, betasum, alphasum, total, level]]

    results = sorted(results, key=lambda x: (x[0]))
    with open(export_path, "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)

# ==== Globals ====

exports = {
    'app-usage-summary': app_usage_summary_csv,
    'app-usage-categories': app_usage_categories_csv,
    'app-usage-endpoints': app_usage_endpoints_csv,
    'coverage-spreadsheet': coverage_spreadsheet_csv,
}

def list_exports():
    return exports.keys()
