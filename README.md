# apisnoop_v3

An apisnoop built for querying from multiple angles using a shared language.

## Setting it up

To get to our APISnoopQL explorer first clone this repo:

```shell
git clone https://github.com:cncf/apisnoop
cd apisnoop
git checkout v3_rainbow
```

Then within the app folder:

```shell
cd apps
. .loadenv
docker-compose up
```

In some other windows start a couple psql clients connecting to the postgres exposed on port 54321:

```shell
cd app
. .loadenv
psql
```


Or visit http://localhost:9000

## Loading audit event logs

Find the logs of interest at https://k8s-testgrid.appspot.com and note the bucket and job.

In the first sql (web or psql) run the following which may take ~60 seconds:

```sql
select * from load_audit_events('ci-kubernetes-e2e-gci-gce','1134962072287711234');
```

When events are loaded, the logs do not record the operation_id.
It is only found by matching each request to the openapi via a regexp and takes some time.
Run this sql (via web or psql) which may take 10-25 minutes:

```sql
select * from audit_event_op_update();
```

We often see audit logs with 30-60k entries. If you want to track the amount of entries that have yet to be updated run the following in psql:

```sql
select COUNT(*) from audit_event where operation_id is null;  \watch 10
```

We also ship a pgadmin running at http://localhost:9001
Username is `apisnoop@cncf.io` password is what's been set in `apps/.env`

## Walk-thru for Test Writing

---

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/cncf/apisnoop&tutorial=org/google-cloudshell/README.md)

---
