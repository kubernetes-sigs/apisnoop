#!/bin/bash
# https://www.netlify.com/docs/continuous-deployment/#environment-variables
set -x
set -e
env
JOBID=$(gsutil cat gs://apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/latest-build.txt)
NEW_BUCKET="zz-bucket: apisnoop/pr-logs/pull/$REVIEW_ID/apisnoop-process-audits/$JOBID/artifacts/"
echo $NEW_BUCKET >> audit-sources.yaml
cp audit-sources.yaml app/public/audit-sources.yaml
