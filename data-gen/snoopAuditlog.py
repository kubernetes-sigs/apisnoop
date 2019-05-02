#!/usr/bin/python
import sys
import os
import re
import json

# python 2 and 3 provide urlparse in different modules
try:
  from urllib.parse import urlparse
except Exception as e:
  from urlparse import urlparse

from lib.parsers import load_openapi_spec, load_audit_log
from processArtifacts import file_to_json

def create_folders():
  for name in ['cache', 'output']:
    try:
      if not os.path.exists(name):
        # we get a race condition here
        os.makedirs(name)
    except Exception as e:
      pass

def generate_endpoints_tree(openapi_spec):
  # Base tests structure, without audit / test loade
  endpoints = {}

  for endpoint in openapi_spec['paths'].values():
    for (method_name, method) in endpoint['methods'].items():
      method = endpoint['methods'][method_name]
      deprecated = True if re.match("[Dd]eprecated", method["description"]) else False
      operationId = method['operationId']

      if operationId not in endpoints.keys():
        # Populate the initial endpoint[operation]
        endpoints[operationId] = {}
        endpoints[operationId]["path"] = endpoint["path"]
        endpoints[operationId]["level"] = endpoint["level"]

      if method_name == "watch":
        endpoints[operationId]["hasWatch"] = True
        continue # to next method in endpoint[operationId]

      # Hoist/flatten method information up to operationId
      for item in ["category", "group", "kind", "version", "description" ]:
        endpoints[operationId][item] = endpoint["methods"][method_name][item]

      endpoints[operationId]["isDeprecated"] = deprecated
      endpoints[operationId]["hits"] = 0
      endpoints[operationId]["testHits"] = 0
      endpoints[operationId]["conformanceHits"] = 0

  return endpoints

def find_openapi_entry(openapi_spec, event):
  url = urlparse(event['requestURI'])
  hit_cache = openapi_spec['hit_cache']
  prefix_cache = openapi_spec['prefix_cache']
  # 1) Cached seen before results
  if url.path in hit_cache:
    return hit_cache[url.path]
  # 2) Indexed by prefix patterns to cut down search time
  for prefix in prefix_cache:
    if prefix is not None and url.path.startswith(prefix):
      # print prefix, url.path
      paths = prefix_cache[prefix]
      break
  else:
    paths = prefix_cache[None]

  for regex in paths:
    if re.match(regex, url.path):
      hit_cache[url.path] = openapi_spec['paths'][regex]
      return openapi_spec['paths'][regex]
    elif re.search(regex, event['requestURI']):
      print("Incomplete match", regex, event['requestURI'])
  # import ipdb; ipdb.set_trace(context=60)
  # cache failures too
  hit_cache[url.path] = None
  return None

discovery_ops = [
    'get/getCoreAPIVersions',
    'get/getAPIVersions',
    'get/getAppsV1beta2APIResources',
    'get/getAdmissionregistrationV1beta1APIResources',
    'get/getAuthenticationV1APIResources',
    'get/getAuthenticationV1beta1APIResources',
    'get/getAuthorizationV1APIResources',
    'get/getAuthorizationV1beta1APIResources',
    'get/getAutoscalingV1APIResources',
    'get/getAutoscalingV2beta1APIResources',
    'get/getAutoscalingV2beta2APIResources',
    'get/getApiextensionsV1beta1APIResources',
    'get/getApiregistrationV1APIResources',
    'get/getApiregistrationV1beta1APIResources',
    'get/getAppsV1APIResources',
    'get/getAppsV1beta1APIResources',
    'get/getAppsV1beta2APIResources',
    'get/getBatchV1APIResources',
    'get/getBatchV1beta1APIResources',
    'get/getBatchV2alpha1APIResources',
    'get/getCertificatesV1beta1APIResources',
    'get/getCoordinationV1APIResources',
    'get/getCoordinationV1beta1APIResources',
    'get/getEventsV1beta1APIResources',
    'get/getExtensionsV1beta1APIResources',
    'get/getNodeV1beta1APIResources',
    'get/getPolicyV1beta1APIResources',
    'get/getSettingsV1alpha1APIResources',
    'get/getSchedulingV1APIResources',
    'get/getSchedulingV1beta1APIResources',
    'get/getSchedulingV1alpha1APIResources',
    'get/getStorageV1APIResources',
    'get/getRbacAuthorizationV1APIResources',
    'get/getRbacAuthorizationV1beta1APIResources',
    'get/getStorageV1beta1APIResources',
    'get/getNetworkingV1beta1APIResources',
    'get/getNetworkingV1APIResources',
    'post/createCoreV1Namespace',
    'get/readCoreV1Namespace',
    'post/createRbacAuthorizationV1beta1NamespacedRoleBinding',
    'post/createAuthorizationV1beta1SubjectAccessReview',
    'watch/listCoreV1NamespacedServiceAccount',
    'get/readCoreV1NamespacedPod',
    # 'post/createCoreV1NamespacedPod',
]

def generate_coverage_report(openapi_spec, audit_log):
  endpoints = generate_endpoints_tree(openapi_spec)
  tests = {}
  test_tags = {}
  test_sequences = {}
  useragents = {}
  for event in audit_log:
    spec_entry = find_openapi_entry(openapi_spec, event)
    # skip if we don't see the url in the OpenAPI spec
    if spec_entry is None:
      continue # and skip to next event
    # skip ef wo don't see the url+method in the OpenAPI spec
    method = event['method']
    if method not in spec_entry['methods'].keys():
      continue # and skip to next event
    # at this point we know we want to process further
    useragent = event.get('userAgent', ' ') # if not userAgent, use " "
    operationId = spec_entry['methods'][method]['operationId']
    method_op = method + '/' + operationId
    endpoints[operationId]['hits'] += 1

    test_name = False
    hit_by_e2e = True if event.get(
      'userAgent', False
    ) and useragent.startswith(
      'e2e.test') else False

    if hit_by_e2e:
      endpoints[operationId]['testHits'] += 1
      test_name_start = ' -- '
      if useragent.find(test_name_start) > -1:
        test_name = useragent.split(test_name_start)[1]
        useragent = useragent.split(test_name_start)[0]

    if test_name:
      # Populate tests[]
      if test_name not in tests.keys():
        tests[test_name] = []
      if test_name not in test_sequences.keys():
        test_sequences[test_name] = []
      # if len(test_sequences[test_name]) < 30 and method_op in discovery_ops:
      #if method_op in discovery_ops:
        # we should probably see if we can check if discovery is complete
      #  continue # skip recording if we are using a discovery phase
      if operationId not in tests[test_name]:
        tests[test_name].append(operationId)

      # populate test_sequences[]
      level = endpoints[operationId]['level']
      category = endpoints[operationId]['category']
      test_sequences[test_name].append(
        [event['requestReceivedTimestamp'],
         level, category, method, operationId])

      # populate test_tags[]
      tags = re.findall(r'\[.+?\]', test_name)
      for tag in tags:
        if tag == '[Conformance]':
          endpoints[operationId]['conformanceHits'] += 1
        if tag not in test_tags.keys():
          test_tags[tag] = []
        if operationId not in test_tags[tag]:
          test_tags[tag].append(operationId)

    agent = useragent.split(' ')[0]
    if agent not in useragents.keys():
      useragents[agent] = []
    if operationId not in useragents[agent]:
      useragents[agent].append(operationId)

  # Nice debug point to check for hits etc
  # {k: v for k, v in endpoints.iteritems() if v['hits'] > 0}
  report = {}
  report['endpoints'] = endpoints
  report['tests'] = tests
  report['test_tags'] = test_tags
  report['test_sequences'] = test_sequences
  report['useragents'] = useragents
  return report

def usage_and_exit():
  print("Usage:")
  print("  snoopAuditlog.py <auditfile> <outfolder>")
  print("    - Process audit file for use with webui")
  exit(1)

def main():
  if len(sys.argv) < 3:
    usage_and_exit()
  # create folder structure on disk
  create_folders()

  filename = sys.argv[1]
  if not os.path.isfile(filename):
    print("Invalid filename given")
    usage_and_exit()
  auditpath = os.path.dirname(filename)
  metadata = file_to_json(auditpath + '/artifacts/metadata.json')
  finished = file_to_json(auditpath + '/finished.json')
  semver = finished['version'].split('v')[1].split('-')[0]
  major = semver.split('.')[0]
  minor = semver.split('.')[1]

  # TODO: some better logic for retreiving the openapi spec to load
  # We could look at the audit_log, rather than requiring it on the cli
  if minor == '15':
    branch_or_tag = metadata["revision"].split("+")[1]
  else:
    branch_or_tag = "release-" + major + "." + minor
  openapi_uri = "https://raw.githubusercontent.com/kubernetes/kubernetes/%s/api/openapi-spec/swagger.json" % (branch_or_tag)

  openapi_spec = load_openapi_spec(openapi_uri)
  audit_log = load_audit_log(filename)
  report = generate_coverage_report(openapi_spec, audit_log)

  output_path = sys.argv[2]
  for key in report.keys():
    open(output_path+"/"+key+".json", 'w').write(
      json.dumps(report[key]))

  md = finished['metadata']
  for key in ['passed','result','timestamp']:
    md[key] = finished[key]
  open(output_path+"/metadata.json", 'w').write(
    json.dumps(md))

  return  # we are done

if __name__ == "__main__":
    main()
