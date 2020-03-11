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
from snoopUtils import deep_merge, load_openapi_spec, find_operation_id
import warnings

if "spec" not in GD:
    GD["spec"] = load_openapi_spec('https://raw.githubusercontent.com/kubernetes/kubernetes/7d13dfe3c34f44/api/openapi-spec/swagger.json')
spec = GD["spec"]
event = json.loads(TD["new"]["data"])
if TD["new"]["operation_id"] is None:
    TD["new"]["operation_id"] = find_operation_id(spec, event);
return "MODIFY";
$$ LANGUAGE plpython3u;
reset role;
