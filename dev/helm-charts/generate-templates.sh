#!/usr/bin/env bash
echo "Generating Templates..."
export DIR_TEMPLATES=$(mktemp -d)
echo "Writing templates to $DIR_TEMPLATES..."
./setup.sh
./scan-stable-apps.sh
./scan-incubator-apps.sh
echo "Finished. Check results in $DIR_TEMPLATES"
