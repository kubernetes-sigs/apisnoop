Data Generation
===============

In this directory we keep the scripts used to fetch, and generate data for APISnoop.

APISnoop's user-interface visualizes the data which we've pre-processed.

Currently, this is a manual process. We need to fetch and process the data first.

Usage
-----

### Dependencies

```
python, pip, wget
```

### Install Required Python Packages

```shell
pip install -r ./requirements.txt
```

### Fetch Artifacts

```shell
python downloadArtifacts.py sources.yaml ./data
```

### Generate Script

```shell
python processArtifacts.py data > processArtifacts.sh
```

### Process Artifacts

```shell
bash processArtifacts.sh
```

The output should now be accesible in `./data/processed-logs/`


Importing to APISnoop
---------------------

Please see the backend [README](../web/backend/README.md) for documentation on importing the processed data into APISnoop.

