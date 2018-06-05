
import json

rows = []

with open("output.json", "rb") as f:
    data = json.load(f)
    for item in data:
        rows += ['----------------']
        rows += [item['timestamp']]
        rows += item['lines']
        endpoints = item['endpoints'].items()
        endpoints = sorted(endpoints, key=lambda x: (-x[1], x[0]))
        for endpoint, count in endpoints:
            rows += ["    " + str(count).rjust(4) + ": " + endpoint]

with open("output.txt", "wb") as f:
    f.write("\n".join(rows))
