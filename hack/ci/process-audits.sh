#1/bin/bash
set -e
set -x
export APISNOOP_DEST=$ARTIFACTS
./apisnoop.sh --install
./apisnoop.sh --update-cache
./apisnoop.sh --process-cache
find $HOME
find /logs/artifacts
