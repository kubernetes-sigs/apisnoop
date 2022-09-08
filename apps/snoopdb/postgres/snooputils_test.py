#!/usr/bin/env python3
import snoopUtils as s
import json
import pytest
import random
from bs4 import BeautifulSoup
import re

K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
swagger_url = K8S_GITHUB_REPO + "v1.23.3" + '/api/openapi-spec/swagger.json'

@pytest.mark.parametrize("verb, expected_method", [
    ("", "options"),
    ("list","get"),
    ("get","head"),
    ("delete_collection","delete"),
    ("put","put"),
    ("update","put"),
    ("create","post"),
    ("something",None)
])
def test_assign_verb_to_method(verb,expected_method):
    assert s.assign_verb_to_method(verb,"/api/HEAD") == expected_method


def test_is_spyglass_script():
    goodSoup = BeautifulSoup('<script>var allBuilds = []</script>',features="html.parser")
    tag = goodSoup.script
    assert s.is_spyglass_script(tag) == True

    badSoup = BeautifulSoup("<script src='somewebsite'>var allBuilds = []</script>",'html.parser')
    tag = badSoup.script
    assert s.is_spyglass_script(tag) == False

    badSoup2 = BeautifulSoup("<script src='somewebsite'>analytic spy key thing</script>",'html.parser')
    tag = badSoup2.script
    assert s.is_spyglass_script(tag) == False

def test_merge_into():
    d1 = {'a': "trash", 'b': "gone", 'c': {'one': "stay", 'two': "keep"}}
    d2 = {'a': "win", 'b':  "champ", 'c': {'three': "remain"}}
    merged_dict = s.merge_into(d1,d2)
    assert merged_dict['c'] == {'one': "stay", 'two': "keep", 'three': 'remain'}
    assert merged_dict['b'] == "champ"

def test_deep_merge():
    d1 = {'a': "trash", 'b': "gone", 'c': {'one': "stay", 'two': "keep"}}
    d2 = {'a': "win", 'b':  "champ", 'c': {'three': "remain"}}
    d3 = {'a': "prime"}
    merged_dict = s.deep_merge(d1,d2,d3)
    assert merged_dict['a'] == "prime"
    assert merged_dict['b'] == 'champ'

def test_openapi_spec():
    spec = s.load_openapi_spec(swagger_url)
    sample1 = spec['cache'][1]['api']['get']
    sample2 = spec['cache'][3]['api']['v1']['pods']['get']
    assert sample1 == 'getCoreAPIVersions'
    assert sample2 == 'listCoreV1PodForAllNamespaces'

def test_format_uri_parts_for_proxy():
    uri_parts = ['zach','is','cool','proxy','fun','times']
    expected = ['zach','is','cool','proxy','fun/times']
    actual = s.format_uri_parts_for_proxy(uri_parts)
    assert expected == actual

def test_is_namespace_status():
    sample1 = ['hi','cool']
    sample2 = ['hi','cool','namespaces','fun','status']
    shouldBeFalse = s.is_namespace_status(sample1)
    shouldBeTrue = s.is_namespace_status(sample2)
    assert shouldBeFalse == False
    assert shouldBeTrue == True

def test_format_uri_parts_for_namespace_status():
    sample = ['api','v1','namespaces','something','cool','status']
    expected = ['api','v1','namespaces','{name}','status']
    actual = s.format_uri_parts_for_namespace_status(sample)
    assert expected == actual

def test_is_namespace_finalize():
    sample1 = ['hi','cool']
    sample2 = ['hi','cool','namespaces','fun','finalize']
    shouldBeFalse = s.is_namespace_finalize(sample1)
    shouldBeTrue = s.is_namespace_finalize(sample2)
    assert shouldBeFalse == False
    assert shouldBeTrue == True

def test_format_uri_parts_for_namespace_finalize():
    sample = ['api','v1','namespaces','something','cool','finalize']
    expected = ['api','v1','namespaces','{name}','finalize']
    actual = s.format_uri_parts_for_namespace_finalize(sample)
    assert expected == actual

def test_operation_id():
    with open('testdata/audit_event.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id, err = s.find_operation_id(spec,event)
        assert operation_id == 'readCoreV1Node'
        assert err == None
    with open('testdata/audit_event_bad_verb.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id, err = s.find_operation_id(spec,event)
        assert operation_id == None
        assert err == "Could not assign a method from the event verb. Check the event.verb."
    with open('testdata/audit_event_part_count_too_high.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id, err = s.find_operation_id(spec,event)
        assert operation_id == None
        assert err == "part count too high, and not found in open api spec. Check the event's request URI"
    with open('testdata/audit_event_dummy_request.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id, err = s.find_operation_id(spec,event)
        assert operation_id == None
        assert err == "This is a known dummy endpoint and can be ignored. See the requestURI for more info."

def test_akc_version():
    job = s.akc_latest_success()
    version = s.akc_version(job)
    semver_match = re.match("[0-9]+.[0-9]+.[0-9]+",version)
    assert semver_match is not None

def test_akc_commit():
    job = s.akc_latest_success()
    commit = s.akc_commit(job)
    commit_match = re.match("[0-9a-z]+$", commit)
    assert commit_match is not None

def test_akc_loglinks():
    job = s.akc_latest_success()
    loglinks = s.akc_loglinks(job)
    assert len(loglinks) > 0

def test_akc_timestamp():
    job = s.akc_latest_success()
    timestamp = s.akc_timestamp(job)
    timestamp_match = re.match("^[0-9]+$",str(timestamp))
    assert timestamp_match is not None

def test_kgcl_version():
    jv = "v1.26.0-alphastuff+23j5319385"
    version = s.kgcl_version(jv)
    assert version == "1.26.0"

def test_kgcl_commit():
    jv = "v1.26.0-alpha.0.275+41df8167dd82e7"
    commit = s.kgcl_commit(jv)
    assert commit == "41df8167dd82e7"

def test_kgcl_loglinks():
    testgrid_history = s.get_json(s.GCS_LOGS + s.KGCL_BUCKET + "/jobResultsCache.json")
    successes = [x["buildnumber"] for x in testgrid_history if x['result'] == 'SUCCESS']
    job = random.choice(successes)
    loglinks = s.kgcl_loglinks(job)
    assert len(loglinks) > 0

def test_kgcl_timestamp():
    testgrid_history = s.get_json(s.GCS_LOGS + s.KGCL_BUCKET + "/jobResultsCache.json")
    successes = [x["buildnumber"] for x in testgrid_history if x['result'] == 'SUCCESS']
    job = random.choice(successes)
    timestamp = s.kgcl_timestamp(job)
    timestamp_match = re.match("^[0-9]+$",str(timestamp))
    assert timestamp_match is not None

def test_kegg_version():
    jv = "v1.26.0-alphastuff+23j5319385"
    version = s.kegg_version(jv)
    assert version == "1.26.0"

def test_kegg_commit():
    jv = "v1.26.0-alpha.0.275+41df8167dd82e7"
    commit = s.kegg_commit(jv)
    assert commit == "41df8167dd82e7"

def test_kegg_loglinks():
    testgrid_history = s.get_json(s.GCS_LOGS + s.KEGG_BUCKET + "/jobResultsCache.json")
    successes = [x["buildnumber"] for x in testgrid_history if x['result'] == 'SUCCESS']
    job = random.choice(successes)
    loglinks = s.kegg_loglinks(job)
    assert len(loglinks) > 0

def test_kegg_timestamp():
    testgrid_history = s.get_json(s.GCS_LOGS + s.KEGG_BUCKET + "/jobResultsCache.json")
    successes = [x["buildnumber"] for x in testgrid_history if x['result'] == 'SUCCESS']
    job = random.choice(successes)
    timestamp = s.kegg_timestamp(job)
    timestamp_match = re.match("^[0-9]+$",str(timestamp))
    assert timestamp_match is not None
