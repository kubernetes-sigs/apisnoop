# apisnoop_v3

An apisnoop built for querying from multiple angles using a shared language.

## Setting it up

To get to our graphql explorer first clone this repo:

```shell
# If you have ssh keys setup with yr gitlab account
git clone git@gitlab.ii.coop:apisnoop/apisnoop_v3.git

# if you don't have them yet
git clone https://gitlab.ii.coop/apisnoop/apisnoop_v3.git
```

from within the repo, start up our src/index.js file

```shell
cd apisnoop_v3
node ./src/index.js
```

You can then visit the explorer at `localhost:4000**

## Example Queries

This is still early on, and has the most basic queries.  There is also no real data added to it yet.

But just to prove it is working, you can run these queries:

**All AuditLogs, with their Endpoints**
```graphql
query{
  auditLogs{
    version
    job
    bucket
    passed
    endpoints{
      operationID
      level
      category
      kind
    }
  }
}
```

**Endpoints, filtered to those with `get` in their operationID***
```graphql
query{
  endpoints(operationID:"get"){
    operationID
    conformanceHits
    hits
    auditLog{
      version
      bucket
      job
    }
  }
}
```

## Tracking Progress
We are keepign an org file as a sort of dev diary and primer on this project.  You can read it at
[org/flow.org](org/flow.org)
