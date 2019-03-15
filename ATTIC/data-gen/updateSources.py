#!/usr/bin/env python
import yaml
try:
    from urllib.request import urlopen, urlretrieve
except Exception as e:
    from urllib import urlopen, urlretrieve
import re
from bs4 import BeautifulSoup
import click

gubernator = "https://gubernator.k8s.io/builds/kubernetes-jenkins/logs/"

def get_html(url):
    html = urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    return soup

@click.command()
@click.argument('sources')
def main(sources):
    syaml = yaml.load(open(sources).read())
    for top, level in syaml.items():
        for sublevel, entry in level.items():
            for bucket, jobs in entry.items():
                testgrid_history = get_html(gubernator + bucket)
                latest_success= int(
                    testgrid_history.find(
                        title=re.compile("SUCCESS")
                    ).parent.text.split(
                        '\n'
                    )[0].encode (
                        'ascii','ignore'
                    )
                )
                syaml[top][sublevel][bucket]=[latest_success]
    with open(sources, "w") as f:
        yaml_content = yaml.dump(syaml,
                                 indent=4,
                                 default_flow_style=False)
        f.write(yaml_content)
        print(yaml_content)

if __name__ == "__main__":
    main()
