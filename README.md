# SnoopDB


This is a slim database for querying the details and progress of [kubernetes conformance testing coverage](https://github.com/cncf/k8s-conformance)
It is used to create coverage data as json files, which run visualizations on [apisnoop.cncf.io](https://apisnoop.cncf.io)

You can also run the database as a docker container, to do ad-hoc queries or one-off reports.

The database is made with [postgres](https://www.postgresql.org/)

# Running the database yourself
_Note: _Running the db requires [docker](https://docker.com)__

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

This will set up a container port forwarded to `localhost:5432`

You can interfance with it using psql and the command line repl by running

```
psql -U postgres -d postgres -H localhost
````

Or you can interface with it through your text editor.  Emacs, with org-mode, works well with this db.

When the container starts up, it runs through a set of sql files located in `postgres/initdb`.  These will setup a number of tables and views plus download all data required, namely open api specs from 1.5 to the current release, and the latest e2e test run stored on gcsweb.

snoopDB is extensively commented, and it is recommended to use the psql commands `\d` and `\d+` to learn more about the database.
