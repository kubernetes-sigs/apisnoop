#!/usr/bin/env sh

# Our main command line script
APISNOOP_SOURCES=${APISNOOP_SOURCES:-"./data-gen/sources.yaml"}
APISNOOP_CACHE=${APISNOOP_CACHE:-"./data-gen/cache"}
APISNOOP_DEST=${APISNOOP_DEST:-"./data-gen/processed"}
APISNOOP_GCS_PREFIX=${APISNOOP_GCS_PREFIX:-"gs://apisnoop/dev/"}
APISNOOP_PATH=${APISNOOP_PATH:-"./data-gen"}
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

install_reqs() {
  pip install -r "${APISNOOP_PATH}"/requirements.txt
}

update_sources() {
  "${APISNOOP_PATH}"/updateSources.py "${APISNOOP_SOURCES}"
}

update_cache() {
  "${APISNOOP_PATH}"/downloadArtifacts.py "${2:-$APISNOOP_SOURCES}" "${3:-$APISNOOP_CACHE}"
}

process_cache() {
  "${APISNOOP_PATH}"/processArtifacts.py "${2:-$APISNOOP_CACHE}" "${3:-$APISNOOP_DEST}" > "${APISNOOP_PATH}"/processArtifacts.sh
  bash "${APISNOOP_PATH}"/processArtifacts.sh
}

upload_apiusage() {
  cd "$APISNOOP_DEST" || exit
  gsutil -m cp -R -n ./ "$APISNOOP_GCS_PREFIX"
}

download_apiusage() {
  mkdir -p "$APISNOOP_DEST"
  cat "$APISNOOP_SOURCES" | \
   yq -r '."sig-release"[] | to_entries[] | "\(.key)/\(.value[0])"' | \
   while read bucket; do
	   mkdir -p "$APISNOOP_DEST"/$bucket;
	   gsutil -m cp -R -n "${APISNOOP_GCS_PREFIX}"$bucket/* "$APISNOOP_DEST"/$bucket;
   done
  echo mv "$APISNOOP_DEST"/*/* "$APISNOOP_DEST" || true
}

if [ $# -eq 0 ]; then
  print_help
elif [ "$1" = "--install" ]; then
  install_reqs
elif [ "$1" = "--update-sources" ]; then
  update_sources "$@"
elif [ "$1" = "--update-cache" ]; then
  update_cache "$@"
elif [ "$1" = "--process-cache" ]; then
  process_cache "$@"
elif [ "$1" = "--upload-apiusage" ]; then
  upload_apiusage "$@"
elif [ "$1" = "--download-apiusage" ]; then
  download_apiusage "$@"
elif [ "$1" = "--all" ]; then
  echo "Installing necessary dependencies"
  install_reqs
  echo "Fetching latest artifacts"
  update_cache "$@"
  echo "Processing Artifacts"
  process_cache "$@"
else
  echo "$1 is not a valid flag."
  print_help
fi
