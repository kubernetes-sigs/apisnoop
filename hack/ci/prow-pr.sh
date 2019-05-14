#1/bin/bash
set -e
set -x
env
git remote -v
git fetch origin master

# Ensure there are no changes to audit-sources and data-gen
if git diff --quiet master -- audit-sources.yaml  data-gen/
then
  echo "There are no changes from master"
  echo "Not generating new data"
else
  echo "There are changes from master, lets use the most recent changes"
  export APISNOOP_DEST=$ARTIFACTS
  ./apisnoop.sh --install
  ./apisnoop.sh --update-cache
  ./apisnoop.sh --process-cache
  find /logs/artifacts
fi
