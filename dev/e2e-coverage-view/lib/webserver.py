import json

from bottle import route, run, request, response, template, static_file




# Should really combine with code from exports
from lib.models import *
from collections import defaultdict

@db_session
def endpoint_hits():
    endpoints = Endpoint.select(lambda x: x.level == 'stable')

    #return [(endpoint.method, endpoint.url, endpoint.category, count) for (endpoint, count) in hits]
    return [{
        'method': endpoint.method,
        'url': endpoint.url,
        'category': endpoint.category,
        'hits': [{'ua': x.user_agent, 'count': x.count} for x in endpoint.hits],
    } for endpoint in endpoints]


@route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/static')

# temporary routes until sunburst is fully integrated
@route('/conformance/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/conformance')

# temporary routes until sunburst is fully integrated
@route('/')
def serve_static():
    return static_file('index.html', root='www')

# endpoints
# level,category,method + url,count
@route('/api/v1/stats/endpoint_hits')
def endpoints_view():
    appname = request.query.get('appname')
    return json.dumps(endpoint_hits())
    #app_usage_endpoints


@route('/api/v1/apps')
def list_apps():
    return json.dumps(list_apps_names())


def start_webserver(host='0.0.0.0', port=9090):
    run(host=host, port=port, debug=True)
