import csv

from lib.models import *
from collections import defaultdict

from pony.orm import db_session

@db_session
def main():
    headers = ["app", "stable", "beta", "alpha", "total", "conformance"]
    results = []
    for app in App.select(lambda x: True):
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
    with open("output-summary.csv", "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)


main()
