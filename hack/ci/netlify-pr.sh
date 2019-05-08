#!/bin/bash
set -x
#set -e
echo PR: PR Commit Netlify Deploy
# https://www.netlify.com/docs/continuous-deployment/#environment-variables
env

curl https://storage.googleapis.com/pub/gsutil.tar.gz | tar xfz -
export PATH=$PWD/gsutil:$PATH

# We may need to spend some time looping here and wait for it to exist...
#sleep 25m

# JOBID=$(gsutil cat gs://apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/latest-build.txt)
JOB_ID=$(gsutil ls 'gs://apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/*/artifacts/*/*/endpoints.json' | sort -n | tail -1 | awk -F/ '{print $6}')
NEW_BUCKET="gs-bucket: apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/$JOB_ID/artifacts/"

echo $NEW_BUCKET >> audit-sources.yaml
cat audit-sources.yaml
cp audit-sources.yaml app/public/audit-sources.yaml

cd app
npm install
npm run build
