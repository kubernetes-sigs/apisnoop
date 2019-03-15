import json

from bottle import route, run, static_file

from lib.models import *


@route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='www/static')


@route('/')
def serve_static():
    return static_file('index.html', root='www')


@route('/api/v1/stats/endpoint_hits')
@db_session
def endpoints_view():
    endpoints = Endpoint.select(lambda x: x.level == 'stable')

    hits = [{
        'method': endpoint.method,
        'url': endpoint.url,
        'category': endpoint.category,
        'hits': [{'ua': x.user_agent, 'count': x.count} for x in endpoint.hits],
    } for endpoint in endpoints]
    return json.dumps(hits)


def start_webserver(host='0.0.0.0', port=9090):
    run(host=host, port=port, debug=True)
