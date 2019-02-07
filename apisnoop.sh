#!/usr/bin/env bash

print_help() {
	cat << EOF
Usage: apisnoop [parameters]
This utility can fetch and process Kubernetes audit logs.

Parameters:
  --fetch [source] [destination] Download datasets listed in file. 
				 By default:
				    source is ./data-gen/sources.yaml 
				    destination is ./data-gen/data.
				 Both defaults can be overwritten with optional arguments.

  --process           Process datasets
EOF
}

# Our main command line script
DEFAULT_SOURCE="./data-gen/sources.yaml"
DEFAULT_DEST="./data-gen/data"
if [ $# -eq 0 ]; then
  print_help
elif [ $1 = "--all" ]; then
  echo "Installing necessary dependendies"
  pip install -r ./data-gen/requirements.txt	
  echo "Fetching latest artifacts"
  ./data-gen/downloadArtifacts.py ${2:-$DEFAULT_SOURCE} ${3:-$DEFAULT_DEST}
  echo "Generating shell script to process artifacts"
  ./data-gen/processArtifacts.py ${2:-$DEFAULT_DEST} > ./data-gen/processArtifacts.sh
  echo "Processing Artifacts"
  bash ./data-gen/processArtifacts.sh
elif [ $1 = "--fetch" ]; then
  ./data-gen/downloadArtifacts.py ${2:-$DEFAULT_SOURCE} ${3:-$DEFAULT_DEST}
elif [ $1 = "--process" ]; then
  ./data-gen/processArtifacts.py ${2:-$DEFAULT_DEST} > ./data-gen/processArtifacts.sh
  bash ./data-gen/processArtifacts.sh
elif [ $1 = "--install" ]; then
  pip install -r ./data-gen/requirements.txt	
else
  echo $1 is not a valid flag.  Did you mean --fetch or --process?
fi
