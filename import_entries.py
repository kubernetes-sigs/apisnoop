# Largely from https://hakibenita.com/fast-load-data-python-postgresql

from typing import Iterator, Dict, Any, Optional
from urllib.parse import urlencode
import psycopg2.extras
# import datetime


#------------------------ Profile

# import time
# from functools import wraps
# from memory_profiler import memory_usage


# def profile(fn):
#     @wraps(fn)
#     def inner(*args, **kwargs):
#         fn_kwargs_str = ', '.join('{k}={v}' for k, v in kwargs.items())
#         print('\n{fn.__name__}({fn_kwargs_str})')

#         # Measure time
#         t = time.perf_counter()
#         retval = fn(*args, **kwargs)
#         elapsed = time.perf_counter() - t
#         print('Time   {elapsed:0.4}')

#         # Measure memory
#         mem, retval = memory_usage((fn, args, kwargs), retval=True, timeout=200, interval=1e-7)

#         print('Memory {max(mem) - min(mem)}')
#         return retval

#     return inner


#------------------------ Data

# import requests

def iter_audit_events_from_logfile(path: str) -> Iterator[Dict[str, Any]]:
    import json
    with open(path, 'r') as f:
        for line in f:
            # should probably try some error detection
            yield json.loads(line)

def iter_lines_from_file(path: str) -> Iterator[Dict[str, Any]]:
    with open(path, 'r') as f:
        for line in f:
            yield line

#------------------------ Load

def recreate_audit_events_table(cursor):
    cursor.execute(open('./hasura/migrations/10_table_audit_events.down.sql').read())
    # cursor.execute("CREATE TABLE public.audit_events (event jsonb);")
    cursor.execute(open('./hasura/migrations/10_table_audit_events.up.sql').read())

# http://initd.org/psycopg/docs/cursor.html#cursor.copy_from
# https://docs.python.org/3.7/library/io.html?io.StringIO#io.StringIO


def clean_csv_value(value: Optional[Any]) -> str:
    if value is None:
        return r'\N'
    return str(value).replace('\n', '\\n')

import io

class StringIteratorIO(io.TextIOBase):

    def __init__(self, iter: Iterator[str]):
        self._iter = iter
        self._buff = ''

    def readable(self) -> bool:
        return True

    def _read1(self, n: Optional[int] = None) -> str:
        while not self._buff:
            try:
                self._buff = next(self._iter)
            except StopIteration:
                break
        ret = self._buff[:n]
        self._buff = self._buff[len(ret):]
        return ret

    def read(self, n: Optional[int] = None) -> str:
        line = []
        if n is None or n < 0:
            while True:
                m = self._read1()
                if not m:
                    break
                line.append(m)
        else:
            while n > 0:
                m = self._read1(n)
                if not m:
                    break
                n -= len(m)
                line.append(m)
        return ''.join(line)

def agent_from_entry(entry):
    """
    Return everything before the first '--'
    """
    # import ipdb ; ipdb.set_trace(context=10)
    if 'userAgent' in entry:
        agent = entry['userAgent']
        if agent:
            return agent.split('--')[0]
    # If we didn't match, either way return ""
    return ""

def test_from_entry(entry):
    """
    Return everything after the first '--'
    or an empty string
    """
    # import ipdb ; ipdb.set_trace(context=10)
    if 'userAgent' in entry:
        agent = entry['userAgent']
        if agent and agent.find('--') > -1:
            return agent.split('--')[1]
    # If we didn't match, either way return ""
    return ""

def timestamp_from_entry(entry):
    if 'requestReceivedTimestamp' in entry:
        return entry['requestReceivedTimestamp']
    else:
        return None

def text_from_entry(entry, obj, key):
    if obj in entry:
        if key in obj:
            return obj[key]
    return ""

import json

def jsonb_from_entry(entry, obj, key):
    if obj in entry:
        if key in entry[obj]:
            # import ipdb ; ipdb.set_trace(context=10)
            if '\\' in value:
                # value contains json with escaped json as value
                for annotation, note in entry[obj][key].items():
                    if '"' in note:
                        # we have a note!. for now relpace " => '
                        # value[annotation]=note.replace('"',"'")
                        # or just delete it for now
                        del entry[obj][key][annotation]
                # import ipdb ; ipdb.set_trace(context=10)
            value =  json.dumps(entry[obj][key])
            print(value)
            return value
    return "{}"
# @profile
def audit_event_iterator(connection,
                         audit_events: Iterator[Dict[str, Any]],
                         size: int = 8192) -> None:
    with connection.cursor() as cursor:
        recreate_audit_events_table(cursor)

        audit_events_string_iterator = StringIteratorIO((
            '|'.join(map(clean_csv_value, (
                entry['auditID'],
                entry['level'],
                entry['verb'],
                entry['requestURI'],
                agent_from_entry(entry),
                test_from_entry(entry),
                text_from_entry(entry, 'requestObject', 'kind'),
                text_from_entry(entry, 'requestObject', 'apiVersion'),
                jsonb_from_entry(entry, 'requestObject', 'metadata'),
                jsonb_from_entry(entry, 'requestObject', 'spec'),
                jsonb_from_entry(entry, 'requestObject', 'status'),
                text_from_entry(entry, 'responseObject', 'kind'),
                text_from_entry(entry, 'responseObject', 'apiVersion'),
                jsonb_from_entry(entry, 'responseObject', 'metadata'),
                jsonb_from_entry(entry, 'responseObject', 'spec'),
                jsonb_from_entry(entry, 'responseObject', 'status'),
                timestamp_from_entry(entry)
                # parse_first_brewed(entry['first_brewed']).isoformat(),
            ))) + '\n'
            for entry in audit_events
        ))

        cursor.copy_from(audit_events_string_iterator,
                         'audit_events',
                         sep='|', size=size)

# from bson.json_util import dumps

def write_json(uri, file_path):
    mongo_uri = uri
    client = MongoClient(mongo_uri)
    db = client.test
    restaurants = db.restaurants
    print('Total Record for the collection: ' + str(restaurants.count()))
    f = open(file_path, 'w')

    for record in restaurants.find():
        record = dumps(record)
        f.write(record + '\n')
    f.close()

def pg_load(conn, table_name, file_path):
    try:
        # conn = psycopg2.connect(connection_string)
        # print("Connecting to Database")
        cur = conn.cursor()
        json_per_line = open(file_path, "r")
        print("LOADING")
        with connection.cursor() as cursor:
            recreate_audit_events_table(cursor)
            cursor.copy_expert(
                "copy {} FROM STDIN WITH CSV quote e'\x01' delimiter e'\x02'".format(table_name),
                json_per_line)
        cursor.execute("commit;")
        print("Loaded data into {}".format(table_name))
        # conn.close()
        print("DB connection closed.")
    except Exception as e:
        print('Error {}'.format(str(e)))

# write_json(mongo_uri, file_path)
# mongo_uri = 'mongodb://<user>:<pw>@<uri>:27017/test'
# connection_string = "dbname='<dbname>' user='<user>' host='<uri>' password='<pw>'"
# import pymongo
# from pymongo import MongoClient
# import psycopg2

connection = psycopg2.connect(
    host='192.168.1.17',
    database='apisnoop_hh',
    port=5434,
    user='hh',
    password=None,
)
connection.set_session(autocommit=True)

table_name = 'audit_events'
file_path = '/tmp/restaurants_json.csv'
audit_logfile="/zfs/home/hh/apisnoop/data-gen/cache/ci-kubernetes-e2e-gci-gce/1140482435658551297/kube-apiserver-audit.log"

# event_lines = list(iter_lines_from_file(
#     audit_logfile
# ))

# pg_load(connection, table_name, event_lines)
# pg_load(connection, table_name, audit_logfile)

# from psycopg2.extras import NamedTupleCursor

events = list(iter_audit_events_from_logfile(
    audit_logfile
))

audit_event_iterator(connection, events)
