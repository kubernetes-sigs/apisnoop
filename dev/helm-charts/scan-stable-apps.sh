#!/usr/bin/env bash
echo "Generating templates for 'stable' apps..."
cd $DIR_TEMPLATES
for FOLDER in $(cat stable-apps.txt)
do
  echo "Processing stable/$FOLDER..."
  cd $DIR_TEMPLATES/charts/stable/$FOLDER && helm template . &> $DIR_TEMPLATES/stable/$FOLDER.yaml
done
