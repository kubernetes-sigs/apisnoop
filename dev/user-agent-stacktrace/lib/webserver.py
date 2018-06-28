import json

from bottle import route, run, request, response, template, static_file




# Should really combine with code from exports
from lib.models import *
from collections import defaultdict

@db_session
def app_usage_categories(app_name=None):
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
    return [headers] + results

@db_session
def app_usage_endpoints(app_name=None):
    headers = ['level', 'category', 'method + url', 'count']
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

    for endpoint, count in hits:
        category = endpoint.category
        if category == '':
            category = "uncategorized"
        results += [[endpoint.level, category, endpoint.method + " " + endpoint.url, count]]
    for level, category, count in misses:
        if category == '':
            category = "uncategorized"
        results += [[level, category, "unused", count]]
    return [headers] + results

@db_session
def coverage_spreadsheet():
    apps = App.select(lambda x: True).order_by(App.name)
    endpoints = Endpoint.select(lambda x: True).order_by(Endpoint.level, Endpoint.url, Endpoint.method)

    headers = ['level', 'category', 'method', 'url', 'conforms', 'apps using it']
    for app in apps:
        headers += [app.name]
    headers += ['questions']

    results = []

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
    return [headers] + results

@db_session
def app_usage_summary(app_name=None):
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
    return [headers] + results


@db_session
def list_apps_names():
    names = []
    for app in App.select(lambda x: True):
        names += [app.name]
    return sorted(names)

@route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/static')

# temporary routes until sunburst is fully integrated
@route('/sunburst/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/sunburst')

# temporary routes until sunburst is fully integrated
@route('/sunburst-apps/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/sunburst-apps')

# temporary routes until sunburst is fully integrated
@route('/')
def serve_static():
    return static_file('index.html', root='www')

# summaries
# app,stable,beta,alpha,total,conformance
@route('/api/v1/stats/summary')
def summary_view():
    appname = request.query.get('appname')
    return json.dumps(app_usage_summary(appname))
    #app_usage_summary

# categories
# app,level,category,count
@route('/api/v1/stats/categories')
def categories_view():
    appname = request.query.get('appname')
    return json.dumps(app_usage_categories(appname))
    #app_usage_categories

# endpoints
# level,category,method + url,count
@route('/api/v1/stats/endpoints')
def endpoints_view():
    appname = request.query.get('appname')
    return json.dumps(app_usage_endpoints(appname))
    #app_usage_endpoints

# conformance spreadsheet
# level,category,method,url,conforms,apps using it,dex,gocd,kubewatch,questions
@route('/api/v1/stats/conformance')
def conformance_view():
    return json.dumps(coverage_spreadsheet())
    #coverage_spreadsheet

@route('/api/v1/apps')
def list_apps():
    return json.dumps(list_apps_names())


def start_webserver(host='0.0.0.0', port=9090):
    run(host=host, port=port, debug=True)
