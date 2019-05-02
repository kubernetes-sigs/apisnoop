#!/usr/bin/env python
import yaml
try:
    from urllib.request import urlopen, urlretrieve
except Exception as e:
    from urllib import urlopen, urlretrieve
import re
from bs4 import BeautifulSoup
import click
import json

gubernator = "https://gubernator.k8s.io/builds/kubernetes-jenkins/logs/"

gcs_logs="https://storage.googleapis.com/kubernetes-jenkins/logs/"

def get_json(url):
    body = urlopen(url).read()
    data = json.loads(body)
    return data

@click.command()
@click.argument('sources')
def main(sources):
    # https://github.com/yaml/pyyaml/wiki/PyYAML-yaml.load(input)-Deprecation
    syaml = yaml.load(open(sources).read())
    for bucket, info in syaml['buckets'].items():
        try:
            testgrid_history = get_json(gcs_logs + bucket + "/jobResultsCache.json")
        except:
            import ipdb; ipdb.set_trace(context=60)
        latest_success = [x for x in testgrid_history if x['result'] == 'SUCCESS'][-1]['buildnumber']
        syaml['buckets'][bucket]['jobs']=[str(latest_success)]
        if bucket == syaml['default-view']['bucket']:
            syaml['default-view']['job']=str(latest_success)
    with open(sources, "w") as f:
        yaml_content = yaml.dump(syaml,
                                 indent=4,
                                 default_flow_style=False)
        f.write(yaml_content)
        print(yaml_content)

if __name__ == "__main__":
    main()
