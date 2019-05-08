#!/bin/bash
set -x
#set -e
echo PRODUCTION: Merge or Commit into Master
# https://www.netlify.com/docs/continuous-deployment/#environment-variables
env

find .

curl https://storage.googleapis.com/pub/gsutil.tar.gz | tar xfz -
export PATH=$PWD/gsutil:$PATH

# We may need to spend some time looping here and wait for it to exist...
#sleep 25m
# There seems to be a hard time limit...
# https://app.netlify.com/sites/apisnoop/deploys/5cd2ecfb0cd9cd00083ebd37
# failed during stage 'building site': Command did not finish within the time limit

# This job ID will be the lastest-build, which may come from a slightly earlier commit
# Let's figure out a way to poll github+prow to know when this job is complete
JOBID=$(gsutil cat gs://apisnoop/logs/apisnoop-postprocess-audits/latest-build.txt)
NEW_BUCKET="gs-bucket: apisnoop/logs/apisnoop-postprocess-audits/$JOBID/artifacts/"

# We only need to know which bucket to pull from:
echo $NEW_BUCKET >> audit-sources.yaml
cat audit-sources.yaml
cp audit-sources.yaml app/public/audit-sources.yaml

cd app
npm install
npm run build
