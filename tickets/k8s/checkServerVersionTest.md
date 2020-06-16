# Progress <code>[1/6]</code>

-   [X] APISnoop org-flow: [checkServerVersionTest.org](https://github.com/cncf/apisnoop/blob/master/tickets/k8s/checkServerVersionTest.org)
-   [ ] Test approval issue: [kubernetes/kubernetes#](https://github.com/kubernetes/kubernetes/issues/#)
-   [ ] Test pr: kuberenetes/kubernetes#
-   [ ] Two weeks soak start date: testgrid-link
-   [ ] Two weeks soak end date:
-   [ ] Test promotion pr: kubernetes/kubernetes#?

# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still an endpoint which is untested.

```sql-mode
SELECT
  operation_id,
  k8s_action,
  http_method,
  version,
  path,
  description
  -- kind
  -- FROM untested_stable_core_endpoints
  FROM untested_stable_endpoints
  where path like '/version/'
  -- and kind like ''
  -- where description ilike 'get the code version'
  -- and operation_id ilike '%APIGroup'
 ORDER BY operation_id
 LIMIT 25
       ;
```

```example
  operation_id  | k8s_action | http_method | version |   path    |     description      
----------------+------------+-------------+---------+-----------+----------------------
 getCodeVersion |            | get         |         | /version/ | get the code version
(1 row)

```

# API Reference and feature documentation

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [Kubernetes API: v1.18](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#)
-   [client-go](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/)

# The mock test

## Test outline

1.  Get the server version (hits api path /version)

2.  Check that the major version is current

## Test the functionality in Go

```go
package main

import (
  "flag"
  "fmt"
  "k8s.io/apimachinery/pkg/version"
  "k8s.io/client-go/kubernetes"
  "k8s.io/client-go/tools/clientcmd"
  "os"
)

func main() {
  // uses the current context in kubeconfig
  kubeconfig := flag.String("kubeconfig", fmt.Sprintf("%v/%v/%v", os.Getenv("HOME"), ".kube", "config"), "(optional) absolute path to the kubeconfig file")
  flag.Parse()
  config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
  if err != nil {
    fmt.Println(err)
    return
  }
  // make our work easier to find in the audit_event queries
  config.UserAgent = "live-test-writing"
  // creates the clientset
  ClientSet, _ := kubernetes.NewForConfig(config)

  // TEST BEGINS HERE
  fmt.Println("[status] begin")

  var version *version.Info
  version, err = ClientSet.Discovery().ServerVersion()

  if version.Major != "1" {
    errMsg := "Failed to get major version, got: " + version.Major + "\n"
    os.Stderr.WriteString(errMsg)
    os.Exit(1)
  }
  fmt.Println("Major version:", version.Major)

  // TEST ENDS HERE
  fmt.Println("[status] complete")
}
```

```go
[status] begin
Major version: 1
[status] complete
```

# Verifying increase in coverage with APISnoop

Discover useragents:

```sql-mode
select distinct useragent from audit_event where bucket='apisnoop' and useragent not like 'kube%' and useragent not like 'coredns%' and useragent not like 'kindnetd%' and useragent like 'live%';
```

```example
     useragent     
-------------------
 live-test-writing
(1 row)

```

List endpoints hit by the test:

```sql-mode
select * from endpoints_hit_by_new_test where useragent like 'live%';
```

```example
     useragent     |  operation_id  | hit_by_ete | hit_by_new_test 
-------------------+----------------+------------+-----------------
 live-test-writing | getCodeVersion | f          |               1
(1 row)

```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------+-----------------+--------------+--------------+------------------
 test_coverage |             458 |          206 |          207 |                1
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by 1 points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
