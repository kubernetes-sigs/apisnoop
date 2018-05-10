import csv

from lib.models import *

from pony.orm import db_session


@db_session
def main():
    results = []
    apps = App.select(lambda x: True).order_by(App.name)
    num_apps = len(apps)
    endpoints = Endpoint.select(lambda x: True).order_by(Endpoint.level, Endpoint.url, Endpoint.method)
    headers = ['level', 'category', 'method', 'url', 'conforms', 'apps using it']

    for app in apps:
        headers += [app.name]
    # for app in apps:
    #     headers += [app.name + ' count']

    headers += ['questions']

    for endpoint in endpoints:
        result = [endpoint.level, endpoint.category, endpoint.method, endpoint.url, endpoint.conforms]
        counts = []
        hits = []
        for app in apps:
            hit = EndpointHit.get(endpoint=endpoint, app=app)
            if hit is not None:
                count = hit.count
            else:
                count = 0
            # hits.append(('', 'x')[count > 0])
            counts.append(count)
        # result += hits
        apps_using = len(filter(lambda x: x > 0, counts))
        result += [apps_using]
        result += counts
        result += [endpoint.questions]
        results += [result]

    idx_using = 5
    idx_method = 2
    idx_url = 3
    idx_level = 0
    idx_category = 1

    results = sorted(results, key=lambda x: (-x[idx_using]))

    with open("output-spreadsheet.csv", "wb") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for result in results:
            writer.writerow(result)


main()
