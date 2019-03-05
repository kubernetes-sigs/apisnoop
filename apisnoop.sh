#!/usr/bin/env bash

# Our main command line script
APISNOOP_SOURCE=${APISNOOP_SOURCE:-"./data-gen/sources.yaml"}
APISNOOP_CACHE=${APISNOOP_CACHE:-"./data-gen/cache"}
APISNOOP_DEST=${APISNOOP_DEST:-"./data-gen/processed"}
APISNOOP_GCS_PREFIX=${APISNOOP_GCS_PREFIX:-"gs://apisnoop/dev/"}

print_help() {
	cat << EOF
Usage: apisnoop [parameters]
This utility can fetch and process Kubernetes audit logs.
      By default:
        source is $APISNOOP_SOURCE
        cache is $APISNOOP_CACHE
        destination is $APISNOOP_DEST
        gcs_prefix is $APISNOOP_GCS_PREFIX
      Defaults can be overwritten with optional arguments.

Parameters:
=======
  --all [source] [cache] [destination] Download and Process based on sources.yaml
  --install           Installs python dependencies
  --update-sources    Check for latest successful jobs and update sources.yaml
  --update-cache      Download raw audit-logs based on sources.yaml
  --process-cache     Process raw audit-logs and save apiusage results to disk
  --upload-apiusage   Upload apiusage results to a gcs bucket
  --download-apiusage Download apiusage results from gcs bucket

Enironment Variables:
=======

  APISNOOP_SOURCE      Current value: ${APISNOOP_SOURCE}
  APISNOOP_CACHE       Current value: ${APISNOOP_CACHE}
  APISNOOP_DEST        Current value: ${APISNOOP_DEST}
  APISNOOP_GCS_PREFIX  Current value: ${APISNOOP_GCS_PREFIX}


EOF
}

if [ $# -eq 0 ]; then
  print_help
elif [ $1 = "--install" ]; then
  pip install -r ./data-gen/requirements.txt
elif [ $1 = "--update-sources" ]; then
  ./data-gen/updateSources.py ./data-gen/sources.yaml
elif [ $1 = "--update-cache" ]; then
  ./data-gen/downloadArtifacts.py ${2:-$APISNOOP_SOURCE} ${3:-$APISNOOP_CACHE}
elif [ $1 = "--process-cache" ]; then
  ./data-gen/processArtifacts.py ${2:-$APISNOOP_CACHE} ${3:-$APISNOOP_DEST} > ./data-gen/processArtifacts.sh
  bash ./data-gen/processArtifacts.sh
elif [ $1 = "--upload-apiusage" ]; then
  cd $APISNOOP_DEST
  gsutil -m cp -R -n ./ $APISNOOP_GCS_PREFIX
elif [ $1 = "--download-apiusage" ]; then
  mkdir -p $APISNOOP_DEST
  gsutil -m cp -R -n $APISNOOP_GCS_PREFIX $APISNOOP_DEST
elif [ $1 = "--all" ]; then
  echo "Installing necessary dependencies"
  pip install -r ./data-gen/requirements.txt
  echo "Fetching latest artifacts"
  ./data-gen/downloadArtifacts.py ${2:-$APISNOOP_SOURCE} ${3:-$APISNOOP_CACHE}
  echo "Generating shell script to process artifacts"
  ./data-gen/processArtifacts.py ${3:-$APISNOOP_CACHE} ${4:-$APISNOOP_DEST} > ./data-gen/processArtifacts.sh
  echo "Processing Artifacts"
  bash ./data-gen/processArtifacts.sh
else
  echo $1 is not a valid flag.  Did you mean --fetch, --update or --process?
fi
