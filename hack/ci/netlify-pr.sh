#!/bin/bash
set -x
#set -e
echo PR: PR Commit Netlify Deploy

# https://www.netlify.com/docs/continuous-deployment/#environment-variables
env

curl https://storage.googleapis.com/pub/gsutil.tar.gz | tar xfz -
export PATH=$PWD/gsutil:$PATH

PRODUCTION_JOB_ID=$(
  gsutil ls \
         'gs://apisnoop/logs/apisnoop-postprocess-audits/*/artifacts/*/*/endpoints.json'\
    | sort -n | tail -1 | awk -F/ '{print $6}')
PRODUCTION_BUCKET="gs-bucket: apisnoop/logs/apisnoop-postprocess-audits/$PRODUCTION_JOB_ID/artifacts/"

PR_JOB_ID=$(
  gsutil ls \
         "gs://apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/*/artifacts/*/*/endpoints.json" \
    | sort -n | tail -1 | awk -F/ '{print $6}')
PR_BUCKET="gs-bucket: apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/$JOB_ID/artifacts/"

git fetch https://github.com/cncf/apisnoop master
git remote -v
git branch -av
find . -type d

# Checking for changes to audit-sources and data-gen
git diff master -- audit-sources.yaml  data-gen/

# Ensure there are no changes to audit-sources and data-gen
if git diff --quiet master -- audit-sources.yaml  data-gen/
then
  # If no changes, use the production
  BUCKET_PREFIX=$PRODUCTION_BUCKET
else
  echo "There are changes from master, lets use the most recent changes"
  if [ -z ${PR_JOB_ID+x} ]
  then
    echo "This initial PR job will need to use the master/production data"
    echo "You'll need to trigger another commit after the data is generated"
    BUCKET_PREFIX=$PRODUCTION_BUCKET
  else
    echo "Using most recent data"
    echo "New data may be available soon, retrigger netlify build in ~30 minutes"
    BUCKET_PREFIX=$PR_BUCKET
  fi
fi

echo $NEW_BUCKET >> audit-sources.yaml
cat audit-sources.yaml
cp audit-sources.yaml app/public/audit-sources.yaml

cd app
npm install
npm run build
