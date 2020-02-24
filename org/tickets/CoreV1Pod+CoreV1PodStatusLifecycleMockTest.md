# Identify an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining Pod endpoints which are untested.

```sql-mode
SELECT
  operation_id,
  -- k8s_action,
  -- path,
  -- description,
  kind
  FROM untested_stable_core_endpoints
  where path not like '%volume%'
  and kind like 'Pod'
  -- and kind like ''
  -- and operation_id ilike '%%'
 ORDER BY kind,operation_id desc
 -- LIMIT 25
       ;
```

```example
            operation_id             | kind 
-------------------------------------|------
 replaceCoreV1NamespacedPodStatus    | Pod
 readCoreV1NamespacedPodStatus       | Pod
 listCoreV1PodForAllNamespaces       | Pod
 deleteCoreV1CollectionNamespacedPod | Pod
(4 rows)

```

# Use API Reference to Lightly Document the Feature

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [client-go - Pod](<https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/pod.go>)

# The mock test

## Test outline

1.  Create a Pod with a static label

2.  Patch the Pod with a new Label and updated data

3.  Get the Pod to ensure it's patched

4.  Read the Pod's status

5.  Replace the Pod's status Ready condition to False

6.  Read the Pod's status to check if Ready is False

7.  List all Pods in all Namespaces find the Pod(1) ensure that the Pod is found and is patched

8.  Delete Namespaced Pod(1) via a Collection with a LabelSelector

9.  Get the Pod to check that it's deleted

## Example in Go

```go
package main

import (
  "encoding/json"
  "time"
  "fmt"
  "flag"
  "os"

  v1 "k8s.io/api/core/v1"
  "k8s.io/client-go/dynamic"
  "k8s.io/apimachinery/pkg/runtime/schema"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  "k8s.io/apimachinery/pkg/types"
  "k8s.io/client-go/tools/clientcmd"
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
  DynamicClientSet, _ := dynamic.NewForConfig(config)
  podResource := schema.GroupVersionResource{Group: "", Version: "v1", Resource: "pods"}

  testNs := "default"
  testPodName := "pod-test"
  testPodImage := "nginx"
  testPodImage2 := "nginx"

  testPod := v1.Pod{
      ObjectMeta: metav1.ObjectMeta{
          Name: testPodName,
          Labels: map[string]string{
              "test-pod-static": "true",
          },
      },
      Spec: v1.PodSpec{
          Containers: []v1.Container{
              {
                 Name: testPodName,
                 Image: testPodImage,
              },
          },
      },
  }
  // create Pod with a static label
  _, err = ClientSet.CoreV1().Pods(testNs).Create(&testPod)
  if err != nil {
      fmt.Println(err)
      return
  }
  fmt.Println("[status] created Pod")

  // setup a watch for the RC
  podWatch, err := ClientSet.CoreV1().Pods(testNs).Watch(metav1.ListOptions{LabelSelector: "test-pod-static=true"})
  if err != nil {
      fmt.Println(err)
      return
  }
  podWatchChan := podWatch.ResultChan()

  fmt.Println("[status] watching for Pod to be ready")
  for event := range podWatchChan {
      podEvent, ok := event.Object.(*v1.Pod)
      if ok != true {
         fmt.Println("Unable to fix type")
         return
      }
      if podEvent.Status.Phase == "Running" {
         break
      }
  }
  fmt.Println("[status] Pod is Ready")

  // patch the Pod with a new Label and updated data
  podPatch, err := json.Marshal(map[string]interface{}{
      "metadata": map[string]interface{}{
          "labels": map[string]string{
              "podtemplate": "patched",
          },
      },
      "spec": map[string]interface{}{
          "containers": []map[string]interface{}{
              {
                  "name": testPodName,
                  "image": testPodImage2,
              },
          },
      },
  })
  if err != nil {
      fmt.Println(err)
      return
  }
  _, err = ClientSet.CoreV1().Pods(testNs).Patch(testPodName, types.StrategicMergePatchType, []byte(podPatch))
  if err != nil {
      fmt.Println(err)
      return
  }

  // get the Pod and ensure it's patched
  pod, err := ClientSet.CoreV1().Pods(testNs).Get(testPodName, metav1.GetOptions{})
  if err != nil {
      fmt.Println(err)
      return
  }
  if pod.ObjectMeta.Labels["test-pod-static"] != "true" || pod.Spec.Containers[0].Image != testPodImage2 {
      fmt.Println("[error] patching of Pod failed")
      return
  }

  // get pod status
  podStatusUnstructured, err := DynamicClientSet.Resource(podResource).Namespace(testNs).Get(testPodName, metav1.GetOptions{}, "status")
  if err != nil {
      fmt.Println(err)
      return
  }
  podStatusUjson, _ := json.Marshal(podStatusUnstructured)
  var podStatus v1.Pod
  json.Unmarshal(podStatusUjson, &podStatus)

  // replace the Pod's status Ready condition to False
  podStatusUpdated := podStatus
  podStatusFieldPatchCount := 0
  podStatusFieldPatchCountTotal := 2
  for pos, cond := range podStatusUpdated.Status.Conditions {
      if (cond.Type == "Ready" && cond.Status == "True") || (cond.Type == "ContainersReady" && cond.Status == "True") {
          podStatusUpdated.Status.Conditions[pos].Status = "False"
          podStatusFieldPatchCount++
      }
  }
  if podStatusFieldPatchCount != podStatusFieldPatchCountTotal {
      fmt.Println("[error] failed to patch all relevant Pod conditions")
      return
  }
  _, err = ClientSet.CoreV1().Pods(testNs).UpdateStatus(&podStatusUpdated)
  if err != nil {
      fmt.Println(err)
      return
  }
  fmt.Println("[status] updated PodStatus")

  // list all Pods and get their status to ensure it's Ready condition is False
  podsList, err := ClientSet.CoreV1().Pods("").List(metav1.ListOptions{LabelSelector: "test-pod-static=true"})
  if err != nil {
      fmt.Println(err)
      return
  }
  fmt.Println("[status] fetched all Pods by LabelSelector")
  podStatusFieldPatchCount = 0
  podStatusFieldPatchCountTotal = 2
  for _, podItem := range podsList.Items {
      for _, cond := range podItem.Status.Conditions {
          if (cond.Type == "Ready" && cond.Status == "False") || (cond.Type == "ContainersReady" && cond.Status == "False") {
              podStatusFieldPatchCount++
          }
      }
  }
  if podStatusFieldPatchCount != podStatusFieldPatchCountTotal {
      fmt.Printf("[error] failed to update PodStatus - %v/%v conditions failed to update (%v, %v)", podStatusFieldPatchCount, podStatusFieldPatchCountTotal, "Ready", "ContainersReady")
      return
  }
  fmt.Println("[status] PodStatus was updated successful")

  // delete the Pod via a Collection with a LabelSelector
  err = ClientSet.CoreV1().Pods(testNs).DeleteCollection(&metav1.DeleteOptions{}, metav1.ListOptions{LabelSelector: "test-pod-static=true"})
  if err != nil {
      fmt.Println(err)
      return
  }

  fmt.Println("[status] watching for Pod to be not Ready")
  podEventChannel:
  for event := range podWatchChan {
      podEvent, ok := event.Object.(*v1.Pod)
      if ok != true {
          fmt.Println("Unable to fix type")
          return
      }

      podStatusFieldPatchCount := 0
      podStatusFieldPatchCountTotal := 2
      for _, cond := range podEvent.Status.Conditions {
          if (cond.Type == "Ready" && cond.Status == "False") || (cond.Type == "ContainersReady" && cond.Status == "False") {
              podStatusFieldPatchCount++
          }
      }
      if podStatusFieldPatchCount == podStatusFieldPatchCountTotal {
          break podEventChannel
      }
  }
  time.Sleep(5 * time.Second)

  fmt.Println("[status] Pod no longer available")

  // fetch the Pod to check if it's deleted
  _, err = ClientSet.CoreV1().Pods(testNs).Get(testPodName, metav1.GetOptions{})
  if err == nil {
      fmt.Println("[error] Pod still available after deletion; failed to delete Pod")
      return
  }

  // write test here
  fmt.Println("[status] complete")

}
```

```go
[status] created Pod
[status] watching for Pod to be ready
[status] Pod is Ready
[status] updated PodStatus
[status] fetched all Pods by LabelSelector
[status] PodStatus was updated successful
[status] watching for Pod to be not Ready
[status] Pod no longer available
[status] complete
```

# Verify Increase it Coverage with APISnoop

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
-------------------|-------------------------------------|------------|-----------------
 live-test-writing | readCoreV1NamespacedPodStatus       | f          |               1
 live-test-writing | readCoreV1NamespacedPod             | t          |               2
 live-test-writing | deleteCoreV1CollectionNamespacedPod | f          |               2
 live-test-writing | patchCoreV1NamespacedPod            | t          |               2
 live-test-writing | listCoreV1PodForAllNamespaces       | f          |               1
 live-test-writing | createCoreV1NamespacedPod           | t          |               2
 live-test-writing | replaceCoreV1NamespacedPodStatus    | f          |               2
 live-test-writing | listCoreV1NamespacedPod             | t          |               1
(8 rows)

```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------|-----------------|--------------|--------------|------------------
 test_coverage |             438 |          190 |          194 |                4
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by 4 points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
