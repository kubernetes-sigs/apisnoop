#!/usr/bin/env python3
import snoopUtils as s
import json
import pytest
from bs4 import BeautifulSoup

K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
swagger_url = K8S_GITHUB_REPO + "v1.23.3" + '/api/openapi-spec/swagger.json'

def test_open_api_spec():
    urls=[swagger_url]
    keys = ['hit_cache', 'cache']

    openapi_spec = s.load_openapi_spec(swagger_url)
    for key in keys:
        assert key in openapi_spec.keys()

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
