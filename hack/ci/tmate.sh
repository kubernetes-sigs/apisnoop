#1/bin/bash
set -e
set -x
echo "Exploring the CI system via tmate"
mkdir -p $ARTIFACTS
env | tee $ARTIFACTS/env
cat <<TMATE > $HOME/.tmate.conf
set-option -g set-clipboard on
set-option -g mouse on
set-option -g history-limit 50000
set -g tmate-identity ""
set -s escape-time 0
set -g tmate-server-host pair.ii.nz
set -g tmate-server-port 22
set -g tmate-server-rsa-fingerprint   "f9:af:d5:f2:47:8b:33:53:7b:fb:ba:81:ba:37:d3:b9"
set -g tmate-server-ecdsa-fingerprint   "32:44:b3:bb:b3:0a:b8:20:05:32:73:f4:9a:fd:ee:a8"
TMATE
date
curl -L https://github.com/tmate-io/tmate/releases/download/2.2.1/tmate-2.2.1-static-linux-amd64.tar.gz \
  | tar xvz -f - -C /usr/local/bin --strip-components 1
ssh-keygen -f ~/.ssh/id_rsa -t rsa -N ''
apt-get update -y
apt-get install -y locales locales-all
echo "Apply tmate magic here"
# sleep 9999999
