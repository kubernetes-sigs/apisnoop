#! /usr/bin/env python3

import json
# try:
from urllib.request import urlopen, urlretrieve
# except Exception as e:
#     from urllib import urlopen, urlretrieve
import os
from shutil import copyfile
import click
import glob
import subprocess
from datetime import datetime

from typing import Iterator, Dict, Any, Optional
from urllib.parse import urlencode
import psycopg2.extras

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

def request_ts_from_entry(entry):
    if 'requestReceivedTimestamp' in entry:
        return entry['requestReceivedTimestamp']
    else:
        return None

def stage_ts_from_entry(entry):
    if 'stageTimestamp' in entry:
        return entry['stageTimestamp']
    else:
        return None

def text_from_entry(entry, obj, key):
    if obj in entry:
        if key in entry[obj]:
            return entry[obj][key]
    return ""


def jsonb_from_entry(entry, obj, key):
    if obj in entry:
        if key in entry[obj]:
            data=entry[obj][key]
            text_data = json.dumps(data)
            if '\\' in text_data:
                # value contains json with escaped json as value
                for subkey, subvalue in data.items():
                    # if not subkey in [
                    #     'name',
                    # ]:
                    text_subvalue = json.dumps(subvalue)
                    # if "holderIdentity" in text_subvalue:
                    if '"' in text_subvalue:
                    # if subkey in ['annotations' ] and '"' in text_subvalue:
                        # we have an annotation!.
                        # and it has json for a value 8(
                        # for now relpace " => '
                        # value[annotation]=note.replace('"',"'")
                        # or just delete it:
                        # import ipdb ; ipdb.set_trace(context=10)
                        # del data[subkey]
                        data[subkey]=""
                        # del entry[obj][key][subkey]
            # value =  json.dumps(entry[obj][key])
            value =  json.dumps(data).replace('|','X')
            # print(value)
            return value
    return "{}"
# @profile
def audit_event_iterator(connection,
                         testrunID,
                         audit_events: Iterator[Dict[str, Any]],
                         size: int = 8192) -> None:
    with connection.cursor() as cursor:
        recreate_audit_events_table(cursor)

        audit_events_string_iterator = StringIteratorIO((
            '|'.join(map(clean_csv_value, (
                entry['auditID'],
                testrunID, #testrunID
                None, #opID will need to be populated later
                entry['stage'],
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
                request_ts_from_entry(entry),
                stage_ts_from_entry(entry)
                # parse_first_brewed(entry['first_brewed']).isoformat(),
            ))) + '\n'
            for entry in audit_events
        ))

        cursor.copy_from(audit_events_string_iterator,
                         'audit_events',
                         sep='|', size=size)

def file_to_json(filename):
    content = open(filename).read()
    data = content.encode('ascii')
    return json.loads(data)

import os
import openapi
@click.command()
@click.argument('artifacts',default='artifacts')
# @click.argument('dbname')
def main(artifacts):#,dbname):
    # for now let's import the master openapi spec manually
    connection = psycopg2.connect(
        host="172.17.0.1",
        # host='192.168.1.17',
        database=os.environ['USER'],
        port=5432,
        user=os.environ['USER'],
        password=None,
    )
    connection.set_session(autocommit=True)
    swagger = openapi.load_openapi_spec(os.environ['HOME']+"/go/src/k8s.io/kubernetes/api/openapi-spec/swagger.json")
    openapi.openapi_operation_iterator(connection,swagger['operations'])

    for auditfile in glob.glob(artifacts + '/*/*/combined-audit.log'):
        auditpath = os.path.dirname(auditfile)
        metadata = file_to_json(auditpath + '/artifacts/metadata.json')
        finished = file_to_json(auditpath + '/finished.json')
        semver = finished['version'].split('v')[1].split('-')[0]
        major = semver.split('.')[0]
        minor = semver.split('.')[1]
        if minor != '16':
            branch = "release-"+major+'.'+minor
        else:
            commit = metadata['revision'].split('+')[-1]
            # branch = 'master'
            branch = commit
        ts = datetime.fromtimestamp(finished['timestamp'])
        if 'conformance' in auditfile:
            type = 'conformance'
        else:
            type = 'sig-release'
        audit_folder = auditpath.split('/')[-2]
        audit_job = auditpath.split('/')[-1]
        audit_name = type + '_' + semver + '_' + str(ts.date())
        events = list(iter_audit_events_from_logfile(auditfile))
        audit_event_iterator(connection, audit_job, events)

if __name__ == "__main__":
    main()
