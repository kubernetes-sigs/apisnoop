-- Create
-- #+NAME: add_opp_id.sql

set role dba;
CREATE FUNCTION add_op_id() RETURNS TRIGGER as $$
import json
from urllib.request import urlopen, urlretrieve
import os
import re
from bs4 import BeautifulSoup
import subprocess
import time
import glob
from tempfile import mkdtemp
from string import Template
from urllib.parse import urlparse
import requests
import hashlib
from collections import defaultdict
import json
import csv
import sys

from copy import deepcopy
from functools import reduce

def deep_merge(*dicts, update=False):
    """
    Merges dicts deeply.
    Parameters
    ----------
    dicts : list[dict]
        List of dicts.
    update : bool
        Whether to update the first dict or create a new dict.
    Returns
    -------
    merged : dict
        Merged dict.
    """
    def merge_into(d1, d2):
        for key in d2:
            if key not in d1 or not isinstance(d1[key], dict):
                d1[key] = deepcopy(d2[key])
            else:
                d1[key] = merge_into(d1[key], d2[key])
        return d1

    if update:
        return reduce(merge_into, dicts[1:], dicts[0])
    else:
        return reduce(merge_into, dicts, {})

def load_openapi_spec(url):
    cache=defaultdict(dict)
    openapi_spec = {}
    openapi_spec['hit_cache'] = {}

    swagger = requests.get(url).json()
    for path in swagger['paths']:
        path_data = {}
        path_parts = path.strip("/").split("/")
        path_len = len(path_parts)
        path_dict = {}
        last_part = None
        last_level = None
        current_level = path_dict
        for part in path_parts:
            if part not in current_level:
                current_level[part] = {}
            last_part=part
            last_level = current_level
            current_level = current_level[part]
        for method, swagger_method in swagger['paths'][path].items():
            if method == 'parameters':
                next
            else:
                current_level[method]=swagger_method.get('operationId', '')
        cache = deep_merge(cache, {path_len:path_dict})
    openapi_spec['cache'] = cache
    return openapi_spec

def find_operation_id(openapi_spec, event):
  verb_to_method={
    'get': 'get',
    'list': 'get',
    'proxy': 'proxy',
    'create': 'post',
    'post':'post',
    'put':'post',
    'update':'put',
    'patch':'patch',
    'connect':'connect',
    'delete':'delete',
    'deletecollection':'delete',
    'watch':'get'
  }
  method=verb_to_method[event['verb']]
  url = urlparse(event['requestURI'])
  # 1) Cached seen before results
  if url.path in openapi_spec['hit_cache']:
    if method in openapi_spec['hit_cache'][url.path].keys():
      return openapi_spec['hit_cache'][url.path][method]
  uri_parts = url.path.strip('/').split('/')
  if 'proxy' in uri_parts:
      uri_parts = uri_parts[0:uri_parts.index('proxy')]
  part_count = len(uri_parts)
  try: # may have more parts... so no match
      cache = openapi_spec['cache'][part_count]
  except Exception as e:
    plpy.warning("part_count was:" + part_count)
    plpy.warning("spec['cache'] keys was:" + openapi_spec['cache'])
    raise e
  last_part = None
  last_level = None
  current_level = cache
  for idx in range(part_count):
    part = uri_parts[idx]
    last_level = current_level
    if part in current_level:
      current_level = current_level[part] # part in current_level
    elif idx == part_count-1:
      if part == 'metrics':
        return None
      if part == 'readyz':
        return None
      if part == 'livez':
        return None
      #   elif part == '': # The last V
      #     current_level = last_level
      #       else:
      variable_levels=[x for x in current_level.keys() if '{' in x] # vars at current(final) level?
      if len(variable_levels) > 1:
        raise "If we have more than one variable levels... this should never happen."
      next_level=variable_levels[0] # the var is the next level
      current_level = current_level[next_level] # variable part is final part
    else:
      next_part = uri_parts[idx+1]
      variable_levels={next_level:next_part in current_level[next_level].keys() for next_level in [x for x in current_level.keys() if '{' in x]}
      if not variable_levels: # there is no match
        if 'example.com' in part:
          return None
        elif 'kope.io' in part:
          return None
        elif 'snapshot.storage.k8s.io' in part:
          return None
        elif 'metrics.k8s.io' in part:
          return None
        elif 'wardle.k8s.io' in part:
          return None
        elif ['openapi','v2'] == uri_parts: # not part our our spec
          return None
        else:
          print(url.path)
          return None
      next_level={v: k for k, v in variable_levels.items()}[True]
      current_level = current_level[next_level] #coo
  try:
    op_id=current_level[method]
  except Exception as err:
    plpy.warning("method was:" + method)
    plpy.warning("current_level keys:" + current_level.keys())
    raise err
  if url.path not in openapi_spec['hit_cache']:
    openapi_spec['hit_cache'][url.path]={method:op_id}
  else:
    openapi_spec['hit_cache'][url.path][method]=op_id
  return op_id

if "spec" not in GD:
    GD["spec"] = load_openapi_spec('https://raw.githubusercontent.com/kubernetes/kubernetes/7d13dfe3c34f44/api/openapi-spec/swagger.json')
spec = GD["spec"]
event = json.loads(TD["new"]["data"])
if TD["new"]["operation_id"] is None:
    TD["new"]["operation_id"] = find_operation_id(spec, event);
return "MODIFY";
$$ LANGUAGE plpython3u;
reset role;
