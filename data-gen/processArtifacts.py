#! /usr/bin/env python

import json
try:
    from urllib.request import urlopen, urlretrieve
except Exception as e:
    from urllib import urlopen, urlretrieve
import os
from shutil import copyfile
import click
import glob
import subprocess
from datetime import datetime


def file_to_json(filename):
    content = open(filename).read()
    data = content.encode('ascii')
    return json.loads(data)

# Find the absolute path to a file, no matter if this script is being run from
# root of apisnoop folder or from within data-gen
def path_to(filename):
    for root, dirs, files in os.walk(r'./'):
        for name in files:
            if name == filename:
                return os.path.abspath(os.path.join(root, name))

@click.command()
@click.argument('infolder')
@click.argument('outfolder')
def main(infolder,outfolder):
    for auditfile in glob.glob(infolder + '/*/*/*audit*log'):
        auditpath = os.path.dirname(auditfile)
        metadata = file_to_json(auditpath + '/artifacts/metadata.json')
        finished = file_to_json(auditpath + '/finished.json')
        semver = finished['version'].split('v')[1].split('-')[0]
        major = semver.split('.')[0]
        minor = semver.split('.')[1]
        if minor != '15':
            branch = "release-"+major+'.'+minor
        else:
            commit = metadata['revision'].split('+')[-1]
            # branch = 'master'
            branch = commit
        ts = datetime.fromtimestamp(finished['timestamp'])
        if 'conformance' in auditfile:
            type = 'conformance'
        else:
            type = 'sig-release'
        auditLogPath = path_to("snoopAuditlog.py")
        audit_folder = auditpath.split('/')[-2]
        audit_job = auditpath.split('/')[-1]
        audit_name = type + '_' + semver + '_' + str(ts.date())
        job_outfolder = outfolder + '/' + audit_folder + '/' + audit_job + '/'
        os.makedirs(job_outfolder)
        copyfile(auditpath + '/artifacts/metadata.json',
                 job_outfolder + "/metadata.json")
        copyfile(auditpath + '/finished.json',
                 job_outfolder + "/finished.json")
        print("(")
        print(
            ' '.join(["python", auditLogPath,
                      auditfile, job_outfolder])
        )
        print(")&")
    print("wait $(jobs -p)")


if __name__ == "__main__":
    main()
