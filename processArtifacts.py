import json
try:
    from urllib.request import urlopen, urlretrieve
except Exception as e:
    from urllib import urlopen, urlretrieve
#import datetime
import os
import click
import glob
import subprocess
from datetime import datetime


def file_to_json(filename):
    content = open(filename).read()
    data = content.encode('ascii')
    return json.loads(data)


@click.command()
@click.argument('folder')
def main(folder):
    print("mkdir -p " + folder + "/processed-audits")
    for auditfile in glob.glob(folder + '/*/*/*audit*log'):
        auditpath = os.path.dirname(auditfile)
        metadata = file_to_json(auditpath + '/artifacts/metadata.json')
        finished = file_to_json(auditpath + '/finished.json')
        semver = finished['version'].split('v')[1].split('-')[0]
        major = semver.split('.')[0]
        minor = semver.split('.')[1]
        if minor != '13':
            branch = "release-"+major+'.'+minor
        else:
            commit = metadata['version'].split('+')[-1]
            # branch = 'master'
            branch = commit
        ts = datetime.fromtimestamp(finished['timestamp'])
        # print auditfile
        # print(metadata['version'] + ' => ' + branch)
        # print(ts.date())
        if 'conformance' in auditfile:
            type = 'conformance'
        else:
            type = 'sig-release'
        outfile = folder + '/processed-audits/' + type + '_' + \
            semver + '_' + str(ts.date()) + ".json"
        print("(python", "audit/logreview.py", "process-audit", auditfile, branch, outfile, ")&")
    print "wait $(jobs -p)"


if __name__ == "__main__":
    main()
