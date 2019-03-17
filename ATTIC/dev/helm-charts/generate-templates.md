---
author: Stephen Heywood
date: 'December 5ith, 2018'
title: Template Generator for Helm Charts
---

Summary
=======

This file is an interactive walkthrough for generating template files
for Helm Charts. A static analysis process will use these templates to
solve a number of questions about the project. The first being, what are
the most common resources used?

Requirements
============

Make sure that you have the following installed

-   git
-   helm

Start each stage
================

``` {.bash}

#!/usr/bin/env bash
echo "Generating Templates..."
export DIR_TEMPLATES=$(mktemp -d)
echo "Writing templates to $DIR_TEMPLATES..."
./setup.sh
./scan-stable-apps.sh
./scan-incubator-apps.sh
echo "Finished. Check results in $DIR_TEMPLATES"
```

Setup the environment
=====================

``` {.bash}

#!/usr/bin/env bash
cd $DIR_TEMPLATES
mkdir $DIR_TEMPLATES/stable
mkdir $DIR_TEMPLATES/incubator
git clone https://github.com/helm/charts
ls charts/stable > stable-apps.txt
ls charts/incubator > incubator-apps.txt
tree -L 1
```

Scan \'stable\' applications
============================

``` {.bash}

#!/usr/bin/env bash
echo "Generating templates for 'stable' apps..."
cd $DIR_TEMPLATES
for FOLDER in $(cat stable-apps.txt)
do
  echo "Processing stable/$FOLDER..."
  cd $DIR_TEMPLATES/charts/stable/$FOLDER && helm template . &> $DIR_TEMPLATES/stable/$FOLDER.yaml
done
```

Scan \'incubator\' applications
===============================

``` {.bash}

#!/usr/bin/env bash
echo "Generating templates for 'incubator' apps..."
cd $DIR_TEMPLATES
for FOLDER in $(cat incubator-apps.txt)
do
  echo "Processing incubator/$FOLDER..."
  cd $DIR_TEMPLATES/charts/incubator/$FOLDER && helm template . &> $DIR_TEMPLATES/incubator/$FOLDER.yaml
done
```

Issues
======

-   Some applications need more setup before we can generate the
    template file. For now an error message is recorded inside the
    `yaml` file.
-   Make the scripts executable as part of the setup/tangle process. For
    now just make sure to `chmod +x *.sh`
