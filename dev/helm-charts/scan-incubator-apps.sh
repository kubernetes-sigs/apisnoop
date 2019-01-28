#!/usr/bin/env bash
echo "Generating templates for 'incubator' apps..."
cd $DIR_TEMPLATES
for FOLDER in $(cat incubator-apps.txt)
do
  echo "Processing incubator/$FOLDER..."
  cd $DIR_TEMPLATES/charts/incubator/$FOLDER && helm template . &> $DIR_TEMPLATES/incubator/$FOLDER.yaml
done
