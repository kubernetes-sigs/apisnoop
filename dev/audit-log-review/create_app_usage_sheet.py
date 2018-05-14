import csv

from lib.models import *
from collections import defaultdict

from pony.orm import db_session

@db_session
def main():
    headers = ["app", "level", "category", "count"]
    results = []
    for app in App.select(lambda x: True):
        hits = EndpointHit.select(lambda hit: hit.app == app and hit.count > 0)
        stats = defaultdict(lambda: defaultdict(int))
        for hit in hits:
            endpoint = hit.endpoint
            stats[endpoint.level][endpoint.category] += 1
        for level in stats:
            for category, count in stats[level].items():
                results += [[app.name, level, category, count]]

    results = sorted(results, key=lambda x: (x[0], -x[-1], x[1], x[2]))
    with open("output-apps.csv", "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)


main()
