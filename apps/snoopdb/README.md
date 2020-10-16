# SnoopDB


This is a slim database for querying the details and progress of [kubernetes conformance testing coverage](https://github.com/cncf/k8s-conformance)
It is used to create coverage data as json files, which run visualizations on [apisnoop.cncf.io](https://apisnoop.cncf.io)

You can also run the database as a docker container, to do ad-hoc queries or one-off reports.

The database is made with [postgres](https://www.postgresql.org/)

# Running the database yourself
There are three likely reasons you'd want to run snoopDB:
- You want to use it to augment writing tests for Kubernetes
- You want to explore test coverage in general
- You want to develop on it

The way to run it for each use case are explained below

## Running it as a test-writer
The simplest way to get a test environment up with snoopDB is to use our kind configuration.
With this, you'd run a few commands to get a cluster up with Kind that has snoopDB pre-installed, and is configured to send out audit events.
With this setup, you can write functions that test some functionality of the cluster, and have these events updated in snoopDB live.  Then, you can run snoopDB queries to see whether your tests hit the endpoints you intend.

### Prerequisites
This method requires:
- [docker](https://docs.docker.com/engine/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [kind](https://kind.sigs.k8s.io/)
- [postgres and psql](https://www.postgresql.org/download/)
### Getting Started with the kind configuration

If you haven't yet, clone this repo and move to the kind repository

``` shell
git clone https://github.com/cncf/apisnoop.git && cd apisnoop/kind
```

Then create a kind cluster

``` shell
kind create cluster --config=kind+apisnoop.yaml
```

This process can take a while, you can setup a ready check with this command

``` shell
  kubectl wait --for=condition=Ready --selector=app.kubernetes.io/name=auditlogger --timeout=600s pod
```

When kubectl gives you the okay, you'll have a postgres database setup with these credentials:
- user :: apisnoop
- database :: apisnoop
- server :: localhost

You can try it out now in your terminal, using psql:

``` shell
  export PGUSER=apisnoop
  export PGHOST=localhost
  psql -c "select * from describe_relations();"
```

This will show you the queries available to you and what they do.  Well done, you are set up!

## Exploring the database on its own

With this, you can spin up a database and explore the latest test coverage and information about the kubernetes API

### Prerequisites
This method requires:
- [docker](https://docs.docker.com/engine/install/)
- [postgres and psql](https://www.postgresql.org/download/)

**NOTE:**  The audit logs we use are quite sizable, taking up several gigs altogether.  You'll want to ensure you have enough space on your computer, and to clean up your docker volumes after.

### Getting Started

use docker to run our latest image, forwarding your local port 5432 to this image's port 5432

``` shell
docker run -p 5432:5432 gcr.io/k8s-staging-apisnoop/snoopdb:v20200923-v2020.09.23-1-gb3afc41 
```

When this runs, you'll have a database at port 5432 with the default credentials:
- user :: postgres
- database :: postgres
- server :: localhost

You can join it using psql

``` shell
psql -U postgres -d postgres -h localhost -c 'select * from describe_relations;'
```

Alternatively, you can pass along environment variables to set a different username and database.   If you wanted snoopdb running with a different user and database, for example, you could run.:

```shell
docker run -p 5432:5432 -e POSTGRES_USER=apisnoop -e POSTGRES_DB=apisnoop gcr.io/k8s-staging-apisnoop/snoopdb:v20200923-v2020.09.23-1-gb3afc41 
```

Then join it with

``` shell
psql -U apisnoop -d apisnoop -h localhost
```

## Setting up for local development
### Prerequisites
This method requires:
- [docker](https://docs.docker.com/engine/install/)
- [postgres and psql](https://www.postgresql.org/download/)

**NOTE:**  The audit logs we use are quite sizable, taking up several gigs altogether.  You'll want to ensure you have enough space on your computer, and to clean up your docker volumes after.

### Getting Started

For this, you will want to clone and move into this repository.
```shell

git clone https://github.com/cncf/apisnoop.git && cd apps/snoopDB
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

All our relations are defined in ~apps/snoopdb/tables-views-functions.org~, using a literate style and so by adjusting and then "tangling"  this file you can build up new migration files.
