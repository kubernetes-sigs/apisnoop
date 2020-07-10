# Progress <code>[1/6]</code>

-   [X] APISnoop org-flow : [ServiceProxyOptionsTest.org](https://github.com/cncf/apisnoop/blob/master/tickets/k8s/ServiceProxyOptionsTest.org)
-   [ ] test approval issue : [kubernetes/kubernetes#](https://github.com/kubernetes/kubernetes/issues/)
-   [ ] test pr : kuberenetes/kubernetes#
-   [ ] two weeks soak start date : testgrid-link
-   [ ] two weeks soak end date :
-   [ ] test promotion pr : kubernetes/kubernetes#?

# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining ServiceProxyOptions endpoints which are untested.

```sql-mode
SELECT
  operation_id,
  -- k8s_action,
  -- path,
  description,
  kind
  FROM untested_stable_core_endpoints
  -- FROM untested_stable_endpoints
  where path not like '%volume%'
  and kind like 'ServiceProxyOptions'
  -- and operation_id ilike '%%'
 ORDER BY kind,operation_id desc
 LIMIT 25
       ;
```

```example
                    operation_id                    |                 description                  |        kind         
----------------------------------------------------+----------------------------------------------+---------------------
 connectCoreV1PutNamespacedServiceProxyWithPath     | connect PUT requests to proxy of Service     | ServiceProxyOptions
 connectCoreV1PutNamespacedServiceProxy             | connect PUT requests to proxy of Service     | ServiceProxyOptions
 connectCoreV1PostNamespacedServiceProxyWithPath    | connect POST requests to proxy of Service    | ServiceProxyOptions
 connectCoreV1PostNamespacedServiceProxy            | connect POST requests to proxy of Service    | ServiceProxyOptions
 connectCoreV1PatchNamespacedServiceProxyWithPath   | connect PATCH requests to proxy of Service   | ServiceProxyOptions
 connectCoreV1PatchNamespacedServiceProxy           | connect PATCH requests to proxy of Service   | ServiceProxyOptions
 connectCoreV1OptionsNamespacedServiceProxyWithPath | connect OPTIONS requests to proxy of Service | ServiceProxyOptions
 connectCoreV1OptionsNamespacedServiceProxy         | connect OPTIONS requests to proxy of Service | ServiceProxyOptions
 connectCoreV1HeadNamespacedServiceProxyWithPath    | connect HEAD requests to proxy of Service    | ServiceProxyOptions
 connectCoreV1HeadNamespacedServiceProxy            | connect HEAD requests to proxy of Service    | ServiceProxyOptions
 connectCoreV1GetNamespacedServiceProxy             | connect GET requests to proxy of Service     | ServiceProxyOptions
 connectCoreV1DeleteNamespacedServiceProxyWithPath  | connect DELETE requests to proxy of Service  | ServiceProxyOptions
 connectCoreV1DeleteNamespacedServiceProxy          | connect DELETE requests to proxy of Service  | ServiceProxyOptions
(13 rows)

```

Looking for feedback on what direction should be taken with these endpoints and the best method for testing them.

# API Reference and feature documentation

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [Kubernetes API: v1.18 Service v1 core Proxy Operations](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#-strong-proxy-operations-service-v1-core-strong-)
-   [client-go](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/)

# The mock test

## Test outline

1.  


2.  


3.  


4.  


5.  

## Test the functionality in Go

```go
package main

import (
  "fmt"
  "context"
  "flag"
  "os"
  v1 "k8s.io/api/core/v1"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  "k8s.io/client-go/tools/clientcmd"
)

func main() {
  // uses the current context in kubeconfig
  kubeconfig := flag.String("kubeconfig", fmt.Sprintf("%v/%v/%v", os.Getenv("HOME"), ".kube", "config"), "(optional) absolute path to the kubeconfig file")
  flag.Parse()
  config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
  if err != nil {
      fmt.Println(err, "Could not build config from flags")
      return
  }
  // make our work easier to find in the audit_event queries
  config.UserAgent = "live-test-writing"
  // creates the clientset
  ClientSet, _ := kubernetes.NewForConfig(config)
  // DynamicClientSet, _ := dynamic.NewForConfig(config)
  // podResource := schema.GroupVersionResource{Group: "", Version: "v1", Resource: "pods"}

  // TEST BEGINS HERE


  // TEST ENDS HERE

  fmt.Println("[status] complete")

}
```

# Verifying increase in coverage with APISnoop

Discover useragents:

```sql-mode
select distinct useragent from audit_event where bucket='apisnoop' and useragent not like 'kube%' and useragent not like 'coredns%' and useragent not like 'kindnetd%' and useragent like 'live%';
```

List endpoints hit by the test:

```sql-mode
select * from endpoints_hit_by_new_test where useragent like 'live%';
```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number
---------------+-----------------+--------------+--------------+------------------
 test_coverage |             438 |          183 |          183 |                0
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by N points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
