#!/usr/bin/env python3
import snoopUtils as s
import json
import pytest
from bs4 import BeautifulSoup

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

def test_get_latest_akc_success():
    file = open('testdata/audit-kind-page.html').read()
    html = BeautifulSoup(file,'html.parser')
    assert s.get_latest_akc_success(html) == "1512178471646793728"

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

# def test_operation_id():
#     with open('testdata/audit_event.json') as eventFile:
#         data = eventFile.read()
#         event = json.loads(data)
#         spec = s.load_openapi_spec(swagger_url)
#         operation_id = s.find_operation_id(spec,event)
#         assert operation_id == 'readCoreV1Node'
#     with open('testdata/bad_audit_event.json') as eventFile:
#         data = eventFile.read()
#         event = json.loads(data)
#         spec = s.load_openapi_spec(swagger_url)
#         operation_id = s.find_operation_id(spec,event)
#         assert operation_id == None
