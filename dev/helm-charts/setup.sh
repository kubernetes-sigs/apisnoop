#!/usr/bin/env bash
set -x -e
cd $DIR_TEMPLATES
mkdir -p $DIR_TEMPLATES/stable
mkdir -p $DIR_TEMPLATES/incubator
git clone --depth 1 https://github.com/helm/charts
ls charts/stable > stable-apps.txt
ls charts/incubator > incubator-apps.txt
tree -L 1
