#! /bin/sh
set -exo
set -u pipefail


if CI=true; then
  curl https://storage.googleapis.com/pub/gsutil.tar.gz | tar xfz -
  wget -O jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
  chmod +x ./jq ; mkdir bin ; mv jq bin/
  curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
  python get-pip.py --user
  export PATH=$PWD/gsutil:$PWD/bin:/app/.local/bin:$PATH
  pip install --user yq
  ./apisnoop.sh --download-apiusage
  cd client && npm install && npm run build
else
  echo "$CI != true, so skipping installation of dependencies. "
  ./apisnoop.sh --download-apiusage
  cd client && npm install && npm run build
fi
