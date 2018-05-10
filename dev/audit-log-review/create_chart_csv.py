import csv

import sys
from lib.models import *

from pony.orm import db_session, select, count

from collections import defaultdict

@db_session
def main(appname=None):
    results = []
    apps = App.select(lambda x: appname is None or x.name == appname).order_by(App.name)

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
    print len(hits), "hits"

    with open('output-chart.csv', 'wb') as f:
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

if len(sys.argv) > 1:
    main(sys.argv[1])
else:
    main()
