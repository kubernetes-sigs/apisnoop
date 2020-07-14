# SnoopDB


This is a slim postgres database for querying the details and progress of kubernetes conformance testing coverage.
The JSON this db outputs is used to generate the visualizations on [apisnoop.cncf.io](https://apisnoop.cncf.io)
You can also run the whole thing as a docker container, to set up your own ad-hoc queries.

# Getting Started
Clone down and enter the directory

```shell
git clone https://github.com/apisnoop/snoopDB.git && cd snoopDB
```

You can then build the database with docker.

```shell
cd postgres
docker build -t snoop .
docker run -p 5432:5432 snoop
```

This will set up a container port forwarded to localhost:5432
You can then reach this db using psql, or through org-mode.
The above command will set the user and database to postgres, with no password.  You can update your run command to include a username and password if you please.

When the container starts up, it runs through a set of sql files located in `postgres/initdb`.  These will setup a number of tables and views plus download all data required, namely open api specs from 1.5 to the current release, and the latest e2e test run stored on gcsweb.

snoopDB is extensively commented, and it is recommended to use the psql commands `\d` and `\d+` to learn more about the database.
