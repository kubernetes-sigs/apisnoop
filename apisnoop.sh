#!/usr/bin/env bash

# Our main command line script
DEFAULT_SOURCE="./data-gen/sources.yaml"
DEFAULT_CACHE="./data-gen/cache"
DEFAULT_DEST="./data-gen/processed"
DEFAULT_GCS_PREFIX="gs://apisnoop/dev/"

print_help() {
	cat << EOF
Usage: apisnoop [parameters]
This utility can fetch and process Kubernetes audit logs.
      By default:
        source is $DEFAULT_SOURCE
        cache is $DEFAULT_CACHE
        destination is $DEFAULT_DEST
        gcs_prefix is $DEFAULT_GCS_PREFIX
      Defaults can be overwritten with optional arguments.

Parameters:
  --fetch [source] [cache] [destination] Download datasets listed in file.
  --update-sources    Check for latest successful jobs and update sources.yaml
  --update-cache      Download raw audit-logs based on sources.yaml
  --process-cache     Process raw audit-logs and save apiusage results to disk
  --upload-apiusage   Upload apiusage results to a gcs bucket
  --download-apiusage Download apiusage results from gcs bucket
EOF
}

if [ $# -eq 0 ]; then
  print_help
elif [ $1 = "--all" ]; then
  echo "Installing necessary dependendies"
  pip install -r ./data-gen/requirements.txt
  echo "Fetching latest artifacts"
  ./data-gen/downloadArtifacts.py ${2:-$DEFAULT_SOURCE} ${3:-$DEFAULT_CACHE}
  echo "Generating shell script to process artifacts"
  ./data-gen/processArtifacts.py ${3:-$DEFAULT_CACHE} ${4:-$DEFAULT_DEST} > ./data-gen/processArtifacts.sh
  echo "Processing Artifacts"
  bash ./data-gen/processArtifacts.sh
elif [ $1 = "--update-sources" ]; then
  ./data-gen/updateSources.py ./data-gen/sources.yaml
elif [ $1 = "--update-cache" ]; then
  ./data-gen/downloadArtifacts.py ${2:-$DEFAULT_SOURCE} ${3:-$DEFAULT_CACHE}
elif [ $1 = "--process-cache" ]; then
  ./data-gen/processArtifacts.py ${2:-$DEFAULT_CACHE} ${3:-$DEFAULT_DEST} > ./data-gen/processArtifacts.sh
  bash ./data-gen/processArtifacts.sh
elif [ $1 = "--upload-apiusage" ]; then
  cd $DEFAULT_DEST
  gsutil -m cp -R -n ./ $DEFAULT_GCS_PREFIX
elif [ $1 = "--download-apiusage" ]; then
  mkdir -p $DEFAULT_DEST
  gsutil -m cp -R -n $DEFAULT_GCS_PREFIX $DEFAULT_DEST
elif [ $1 = "--install" ]; then
  pip install -r ./data-gen/requirements.txt
else
  echo $1 is not a valid flag.  Did you mean --fetch, --update or --process?
fi
