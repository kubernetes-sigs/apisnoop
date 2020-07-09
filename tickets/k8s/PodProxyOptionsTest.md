
# Progress <code>[1/6]</code>

-   [X] APISnoop org-flow : [PodProxyOptionsTest.org](https://github.com/cncf/apisnoop/blob/master/tickets/k8s/PodProxyOptionsTest.org)
-   [ ] test approval issue : [kubernetes/kubernetes#](https://github.com/kubernetes/kubernetes/issues/)
-   [ ] test pr : kuberenetes/kubernetes#
-   [ ] two weeks soak start date : testgrid-link
-   [ ] two weeks soak end date :
-   [ ] test promotion pr : kubernetes/kubernetes#?

# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining RESOURCENAME endpoints which are untested.

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
  and kind like 'PodProxyOptions'
  -- and operation_id ilike '%%'
 ORDER BY kind,operation_id desc
 LIMIT 25
       ;
```

```example
                  operation_id                  |               description                |      kind       
------------------------------------------------+------------------------------------------+-----------------
 connectCoreV1PutNamespacedPodProxyWithPath     | connect PUT requests to proxy of Pod     | PodProxyOptions
 connectCoreV1PutNamespacedPodProxy             | connect PUT requests to proxy of Pod     | PodProxyOptions
 connectCoreV1PostNamespacedPodProxyWithPath    | connect POST requests to proxy of Pod    | PodProxyOptions
 connectCoreV1PostNamespacedPodProxy            | connect POST requests to proxy of Pod    | PodProxyOptions
 connectCoreV1PatchNamespacedPodProxyWithPath   | connect PATCH requests to proxy of Pod   | PodProxyOptions
 connectCoreV1PatchNamespacedPodProxy           | connect PATCH requests to proxy of Pod   | PodProxyOptions
 connectCoreV1OptionsNamespacedPodProxyWithPath | connect OPTIONS requests to proxy of Pod | PodProxyOptions
 connectCoreV1OptionsNamespacedPodProxy         | connect OPTIONS requests to proxy of Pod | PodProxyOptions
 connectCoreV1HeadNamespacedPodProxyWithPath    | connect HEAD requests to proxy of Pod    | PodProxyOptions
 connectCoreV1HeadNamespacedPodProxy            | connect HEAD requests to proxy of Pod    | PodProxyOptions
 connectCoreV1GetNamespacedPodProxy             | connect GET requests to proxy of Pod     | PodProxyOptions
 connectCoreV1DeleteNamespacedPodProxyWithPath  | connect DELETE requests to proxy of Pod  | PodProxyOptions
 connectCoreV1DeleteNamespacedPodProxy          | connect DELETE requests to proxy of Pod  | PodProxyOptions
(13 rows)

```

# API Reference and feature documentation

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [Kubernetes API: v1.18 Pod v1 core Proxy Operations](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#-strong-proxy-operations-pod-v1-core-strong-)
-   [client-go](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed)

# The mock test

## Test outline

1.  Create a RESOURCENAME with a static label

2.  Patch the RESOURCENAME with a new label and updated data

3.  Get the RESOURCENAME to ensure it's patched

4.  List all RESOURCENAMEs in all Namespaces with a static label find the RESOURCENAME ensure that the RESOURCENAME is found and is patched

5.  Delete Namespaced RESOURCENAME via a Collection with a LabelSelector

## Test the functionality in Go

```go
package main

import (
  // "encoding/json"
  "fmt"
  "context"
  "flag"
  "os"
  v1 "k8s.io/api/core/v1"
  // "k8s.io/client-go/dynamic"
  // "k8s.io/apimachinery/pkg/runtime/schema"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  // "k8s.io/apimachinery/pkg/types"
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

  testPodName := "test-pod"
  testPodImage := "nginx"
  testNamespaceName := "default"

  fmt.Println("creating a Pod")
  testPod := v1.Pod{
    ObjectMeta: metav1.ObjectMeta{
      Name: testPodName,
      Labels: map[string]string{"test-pod-static": "true"},
    },
    Spec: v1.PodSpec{
      Containers: []v1.Container{{
        Name: testPodName,
        Image: testPodImage,
      }},
    },
  }
  _, err = ClientSet.CoreV1().Pods(testNamespaceName).Create(context.TODO(), &testPod, metav1.CreateOptions{})
  if err != nil {
      fmt.Println(err, "failed to create Pod")
      return
  }

  fmt.Println("listing Pods")
  pods, err := ClientSet.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{LabelSelector: "test-pod-static=true"})
  if err != nil {
      fmt.Println(err, "failed to list Pods")
      return
  }
  podCount := len(pods.Items)
  if podCount == 0 {
      fmt.Println("there are no Pods found")
      return
  }
  fmt.Println(podCount, "Pod(s) found")

  fmt.Println("deleting Pod")
  err = ClientSet.CoreV1().Pods(testNamespaceName).Delete(context.TODO(), testPodName, metav1.DeleteOptions{})
  if err != nil {
      fmt.Println(err, "failed to delete the Pod")
      return
  }

  // TEST ENDS HERE

  fmt.Println("[status] complete")

}
```

    creating a Pod
    listing Pods
    1 Pod(s) found
    deleting Pod
    [status] complete

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
