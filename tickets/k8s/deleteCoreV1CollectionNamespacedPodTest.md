
# Progress <code>[2/6]</code>

-   [X] APISnoop org-flow: [deleteCoreV1CollectionNamespacedPodTest.org](https://github.com/cncf/apisnoop/blob/master/tickets/k8s/deleteCoreV1CollectionNamespacedPodTest.org)
-   [X] Test approval issue: [kubernetes/kubernetes#90663](https://github.com/kubernetes/kubernetes/issues/90663)
-   [ ] Test pr: kuberenetes/kubernetes#
-   [ ] Two weeks soak start date: testgrid-link
-   [ ] Two weeks soak end date:
-   [ ] Test promotion pr: kubernetes/kubernetes#?

# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still an endpoint which is untested.

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
  -- and kind like ''
  and operation_id ilike 'delete%CollectionNamespacedPod'
 ORDER BY kind,operation_id desc
 LIMIT 25
       ;
```

```example
            operation_id             |       description        | kind 
-------------------------------------+--------------------------+------
 deleteCoreV1CollectionNamespacedPod | delete collection of Pod | Pod
(1 row)

```

# API Reference and feature documentation

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [Kubernetes API: v1.18 /deleteCoreV1CollectionNamespacedPod](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#delete-collection-pods-v1-core)
-   [client-go - Pod: DeleteCollection](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/pod.go)

# The mock test

## Test outline

1.  Create a set of 3 Pods with a static label within a Namespace.

2.  Confirm that all 3 Pods with the label in the Namespace are created.

3.  Delete the set of Namespaced Pods with a label via DeleteCollection.

4.  Confirm that all Pods with the label have been deleted.

## Test the functionality in Go

```go
package main

import (
  "context"
  "flag"
  "fmt"
  "time"
  v1 "k8s.io/api/core/v1"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/apimachinery/pkg/util/wait"
  "k8s.io/client-go/kubernetes"
  "k8s.io/client-go/tools/clientcmd"
  "os"
)

const (
  podRetryPeriod  = 1 * time.Second
  podRetryTimeout = 1 * time.Minute
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

  // create a set of pod test names
  podTestNames := [3]string{"test-pod-nginx-1", "test-pod-nginx-2", "test-pod-nginx-3"}

  // create a set of test pods with a label in the default namespace
  for _, podTestName := range podTestNames {
    _, err = ClientSet.CoreV1().Pods("default").Create(context.TODO(), &v1.Pod{
      ObjectMeta: metav1.ObjectMeta{
        Name: podTestName,
        Labels: map[string]string{
          "type": "Testing"},
      },
      Spec: v1.PodSpec{
        Containers: []v1.Container{{
          Image: "nginx",
          Name:  "nginx",
        }},
        RestartPolicy: v1.RestartPolicyNever,
      }}, metav1.CreateOptions{})

    if err != nil {
      fmt.Println("[error]", err)
      return
    }
    fmt.Println("[status] created", podTestName)
  }

  // wait as required for all 3 pods to be found
  fmt.Println("[status] waiting for all 3 pods to be located")
  err = wait.PollImmediate(podRetryPeriod, podRetryTimeout, checkPodListQuantity(ClientSet, "type=Testing", 3))

  if err != nil {
    errMsg := "[error] 3 pods not found" + fmt.Sprintf("%v\n", err)
    os.Stderr.WriteString(errMsg)
    os.Exit(1)
  }

  // delete Collection of Pods for the label in the default namespace
  _ = ClientSet.CoreV1().Pods("default").DeleteCollection(context.TODO(), metav1.DeleteOptions{}, metav1.ListOptions{
    LabelSelector: "type=Testing"})
  fmt.Println("[status] DeleteCollection processed")

  // wait for all pods to be deleted
  fmt.Println("[status] waiting for all pods to be deleted")
  err = wait.PollImmediate(podRetryPeriod, podRetryTimeout, checkPodListQuantity(ClientSet, "type=Testing", 0))

  if err != nil {
    errMsg := "[error] found a pod(s) " + fmt.Sprintf("%v\n", err)
    os.Stderr.WriteString(errMsg)
    os.Exit(1)
  }
  // TEST ENDS HERE

  fmt.Println("[status] complete")

}

func checkPodListQuantity(ClientSet *kubernetes.Clientset, label string, quantity int) func() (bool, error) {
  return func() (bool, error) {
    var err error
    ns := "default"
    fmt.Println("requesting list of pods to confirm quantity")

    list, err := ClientSet.CoreV1().Pods(ns).List(context.TODO(), metav1.ListOptions{
      LabelSelector: label})

    if err != nil {
      return false, err
    }

    if len(list.Items) != quantity {
      return false, err
    }
    return true, nil
  }
}
```

```go
[status] created test-pod-nginx-1
[status] created test-pod-nginx-2
[status] created test-pod-nginx-3
[status] waiting for all 3 pods to be located
requesting list of pods to confirm quantity
[status] DeleteCollection processed
[status] waiting for all pods to be deleted
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
requesting list of pods to confirm quantity
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
     useragent     |            operation_id             | hit_by_ete | hit_by_new_test 
-------------------+-------------------------------------+------------+-----------------
 live-test-writing | createCoreV1NamespacedPod           | t          |               3
 live-test-writing | deleteCoreV1CollectionNamespacedPod | f          |               1
 live-test-writing | listCoreV1NamespacedPod             | t          |              10
(3 rows)

```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------+-----------------+--------------+--------------+------------------
 test_coverage |             476 |          224 |          225 |                1
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by 1 points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
