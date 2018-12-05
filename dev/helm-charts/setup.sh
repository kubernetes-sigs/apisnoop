#!/usr/bin/env bash
cd $DIR_TEMPLATES
mkdir $DIR_TEMPLATES/stable
mkdir $DIR_TEMPLATES/incubator
git clone https://github.com/helm/charts
ls charts/stable > stable-apps.txt
ls charts/incubator > incubator-apps.txt
tree -L 1
