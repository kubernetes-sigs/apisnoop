#!/usr/bin/python

import json
import re
import os
import sys

from pprint import pprint
from datetime import datetime
import dateutil.parser
from collections import defaultdict

entries = {}

with open("entries.log", "rb") as entriesfile:
    for line in entriesfile:
        data = json.loads(line)
        if len(data['lines']) > 3:
            data['lines'] = data['lines'][-3:]
        timestamp = dateutil.parser.parse(data['timestamp'], ignoretz=True)
        entries[timestamp] = data
        data['endpoints'] = defaultdict(int)

current_entry = before_test = {
    'endpoints': defaultdict(int),
    'lines': [],
    'timestamp': None
}
entries_items = sorted(entries.items(), key=lambda x: x[0])
next_idx = 0
next_timestamp, next_entry = entries_items[next_idx]
next_idx += 1

if len(sys.argv) == 2:
    end_timestamp = dateutil.parser.parse(sys.argv[1], ignoretz=True)
else:
    end_timestamp = None

with open('audit-e2e.log', 'rb') as auditfile:
    for line in auditfile:
        try:
            data = json.loads(line)
        except Exception as e:
            print e
            print line

        timestamp = data['requestReceivedTimestamp']
        timestamp = dateutil.parser.parse(timestamp, ignoretz=True)
        if end_timestamp is not None and timestamp > end_timestamp:
            continue
        endpoint = data['requestURI'].split('?', 1)[0]
        combined = data['verb'] + " " + endpoint
        print next_timestamp, timestamp
        if next_timestamp is not None and timestamp >= next_timestamp:
            current_entry = next_entry
            if len(entries_items) <= (next_idx + 1):
                next_timestamp = None
                next_entry = None
            else:
                next_timestamp, next_entry = entries_items[next_idx]
            next_idx += 1
        current_entry['endpoints'][combined] += 1

output_items = [e[1] for e in entries_items]
with open('output.json', 'wb') as outputfile:
    json.dump(output_items, outputfile)
