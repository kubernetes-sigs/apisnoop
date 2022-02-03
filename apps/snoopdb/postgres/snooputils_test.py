#!/usr/bin/env python3

import snoopUtils as s
import json

K8S_GITHUB_REPO = 'https://raw.githubusercontent.com/kubernetes/kubernetes/'
swagger_url = K8S_GITHUB_REPO + "v1.23.3" + '/api/openapi-spec/swagger.json'

def sums_test():
    assert s.sums(1,2) == 3

def open_api_spec_test():
    urls=[swagger_url]
    keys = ['hit_cache', 'cache']

    for url in urls:
        openapi_spec = s.load_openapi_spec(url)
        for key in keys:
            assert key in openapi_spec.keys()

def operation_id_test():
    with open('audit_event.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id = s.find_operation_id(spec,event)
        assert operation_id == 'readCoreV1Node'
    with open('bad_audit_event.json') as eventFile:
        data = eventFile.read()
        event = json.loads(data)
        spec = s.load_openapi_spec(swagger_url)
        operation_id = s.find_operation_id(spec,event)
        assert operation_id == None


if __name__ == '__main__':
    s.cool()
    sums_test()
    open_api_spec_test()
    operation_id_test()
    print("YOU ARE GOOD TO GOOOOO!!!!!!")
