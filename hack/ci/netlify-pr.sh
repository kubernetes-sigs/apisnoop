#!/bin/bash
set -x
#set -e
echo PR: PR Commit Netlify Deploy
# https://www.netlify.com/docs/continuous-deployment/#environment-variables
env

find .

curl https://storage.googleapis.com/pub/gsutil.tar.gz | tar xfz -
export PATH=$PWD/gsutil:$PATH

# We may need to spend some time looping here and wait for it to exist...
sleep 25m

JOBID=$(gsutil cat gs://apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/latest-build.txt)
NEW_BUCKET="gs-bucket: apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/$JOBID/artifacts/"

echo $NEW_BUCKET >> audit-sources.yaml
cat audit-sources.yaml
cp audit-sources.yaml app/public/audit-sources.yaml

cd app
npm install
npm run build
