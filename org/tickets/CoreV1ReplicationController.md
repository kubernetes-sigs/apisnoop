# Identify an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining ReplicationController endpoints which are untested.

```sql-mode
SELECT
  operation_id,
  -- k8s_action,
  path,
  description
  FROM untested_stable_core_endpoints
  where path not like '%volume%'
  and operation_id ilike '%ReplicationController%'
 ORDER BY operation_id desc
 -- LIMIT 25
       ;
```

```example
                     operation_id                      |                                path                                 |                          description                           
-------------------------------------------------------|---------------------------------------------------------------------|----------------------------------------------------------------
 replaceCoreV1NamespacedReplicationControllerStatus    | /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status | replace status of the specified ReplicationController
 readCoreV1NamespacedReplicationControllerStatus       | /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status | read status of the specified ReplicationController
 patchCoreV1NamespacedReplicationControllerStatus      | /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status | partially update status of the specified ReplicationController
 patchCoreV1NamespacedReplicationControllerScale       | /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/scale  | partially update scale of the specified ReplicationController
 patchCoreV1NamespacedReplicationController            | /api/v1/namespaces/{namespace}/replicationcontrollers/{name}        | partially update the specified ReplicationController
 listCoreV1ReplicationControllerForAllNamespaces       | /api/v1/replicationcontrollers                                      | list or watch objects of kind ReplicationController
 deleteCoreV1CollectionNamespacedReplicationController | /api/v1/namespaces/{namespace}/replicationcontrollers               | delete collection of ReplicationController
(7 rows)

```

# Use API Reference to Lightly Document the Feature

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [client-go - ReplicationController](<https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/replicationcontroller.go>)

# The mock test

## Test outline

1.  Create a ReplicationController with a static label

2.  Patch the ReplicationController with a new Label and updated data

3.  Patch the ReplicationController's status

4.  Patch/Scale the ReplicationController's Replica count to 2 Replicas

5.  Get the ReplicationController

6.  Replace the ReplicationController's Status

7.  List all ReplicationControllers in all Namespaces find the ReplicationControllers(1) ensure that the ReplicationController is found and is patched

8.  Delete Namespaced ReplicationControllers(1) via a Collection with a LabelSelector

## Example in Go

```go
package main

import (
  "encoding/json"
  "fmt"
  "flag"
  "os"

  v1 "k8s.io/api/core/v1"
  metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
  "k8s.io/client-go/kubernetes"
  "k8s.io/apimachinery/pkg/runtime/schema"
  "k8s.io/apimachinery/pkg/types"
  autoscalingv1 "k8s.io/api/autoscaling/v1"
  "k8s.io/client-go/dynamic"
  "k8s.io/client-go/tools/clientcmd"
  //"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

func main() {
  // uses the current context in kubeconfig
  kubeconfig := flag.String("kubeconfig", fmt.Sprintf("%v/%v/%v", os.Getenv("HOME"), ".kube", "config"), "(optional) absolute path to the kubeconfig file")
  flag.Parse()
  config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
  if err != nil {
    fmt.Println(err)
  }
  // make our work easier to find in the audit_event queries
  config.UserAgent = "live-test-writing"
  // creates the clientset
  ClientSet, _ := kubernetes.NewForConfig(config)
  DynamicClientSet, _ := dynamic.NewForConfig(config)
  rcResource := schema.GroupVersionResource{Group: "", Version: "v1", Resource: "replicationcontrollers"}

  testRcName := "rc-test"
  testRcNamespace := "default"
  testRcInitialReplicaCount := int32(1)
  testRcMaxReplicaCount := int32(2)

  rcTest := v1.ReplicationController{
      ObjectMeta: metav1.ObjectMeta{
          Name: testRcName,
          Labels: map[string]string{"test-rc-static": "true"},
      },
      Spec: v1.ReplicationControllerSpec{
          Replicas: &testRcInitialReplicaCount,
          Selector: map[string]string{"test-rc-static": "true"},
          Template: &v1.PodTemplateSpec{
              ObjectMeta: metav1.ObjectMeta{
                  Name: testRcName,
                  Labels: map[string]string{"test-rc-static": "true"},
              },
              Spec: v1.PodSpec{
                  Containers: []v1.Container{{
                      Name: testRcName,
                      Image: "nginx",
                  }},
              },
          },
      },
  }

  // Create a ReplicationController
  _, err = ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Create(&rcTest)
  if err != nil {
      fmt.Println(err)
      return
  }
  fmt.Println("[status] created ReplicationController")

  // setup a watch for the RC
  rcWatch, err := ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Watch(metav1.ListOptions{LabelSelector: "test-rc-static=true"})
  if err != nil {
      fmt.Println(err)
      return
  }
  rcWatchChan := rcWatch.ResultChan()

  fmt.Println("[status] watching for all Replicas to be ready")
  for event := range rcWatchChan {
      rc, ok := event.Object.(*v1.ReplicationController)
      if ok != true {
          fmt.Println("Unable to fix type")
          return
      }
      if rc.Status.Replicas == testRcInitialReplicaCount && rc.Status.ReadyReplicas == testRcInitialReplicaCount {
          break
      }
  }

  rcLabelPatchPayload, err := json.Marshal(v1.ReplicationController{
      ObjectMeta: metav1.ObjectMeta{
          Labels: map[string]string{"test-rc": "patched"},
      },
  })
  if err != nil {
    fmt.Println(err)
    return
  }
  // Patch the ReplicationController
  _, err = ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Patch(testRcName, types.StrategicMergePatchType, []byte(rcLabelPatchPayload))
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println("[status] patched ReplicationController")

  rcStatusPatchPayload, err := json.Marshal(map[string]interface{}{
    "status": map[string]interface{}{
      "readyReplicas": 0,
      "availableReplicas": 0,
    },
  })
  if err != nil {
      fmt.Println(err)
      return
  }

  // Patch the ReplicationController's status
  rcStatus, err := ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Patch(testRcName, types.StrategicMergePatchType, []byte(rcStatusPatchPayload), "status")
  if err != nil {
      fmt.Println(err)
      return
  }
  if rcStatus.Status.ReadyReplicas != 0 {
      fmt.Println("[error] failed to patch ReplicationController status; ReadyReplicas != 0")
      return
  }
  fmt.Println("[status] patched status of ReplicationController")

  rcStatusUnstructured, err := DynamicClientSet.Resource(rcResource).Namespace(testRcNamespace).Get(testRcName, metav1.GetOptions{}, "status")
  if err != nil {
      fmt.Println(err)
      return
  }
  rcStatusUjson, _ := json.Marshal(rcStatusUnstructured)
	json.Unmarshal(rcStatusUjson, &rcStatus)
  if rcStatus.Status.Replicas != testRcInitialReplicaCount {
     fmt.Println("[error] Replica count does not match initial Replica count")
  }
  fmt.Println("[status] fetched ReplicationController status")

  rcScalePatchPayload, err := json.Marshal(autoscalingv1.Scale{
      Spec: autoscalingv1.ScaleSpec{
          Replicas: 2,
      },
  })
  if err != nil {
      fmt.Println(err)
      return
  }

  // Patch the ReplicationController's scale
  rcScale, err := ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Patch(testRcName, types.StrategicMergePatchType, []byte(rcScalePatchPayload), "scale")
  if err != nil {
      fmt.Println(err)
      return
  }
  rcScaleReplicasExpect := int32(2)
  if rcScale.Status.Replicas == rcScaleReplicasExpect {
      fmt.Println("[error] failed to patch ReplicationController scale; ReadyReplicas != 2")
      return
  }
  fmt.Println("[status] patched scale of ReplicationController")

  fmt.Println("[status] watching for all Replicas to be ready")
  for event := range rcWatchChan {
      rc, ok := event.Object.(*v1.ReplicationController)
      if ok != true {
          fmt.Println("Unable to fix type")
          return
      }
      if rc.Status.Replicas == testRcMaxReplicaCount && rc.Status.ReadyReplicas == testRcMaxReplicaCount {
          break
      }
  }

  // Get the ReplicationController
  rc, err := ClientSet.CoreV1().ReplicationControllers(testRcNamespace).Get(testRcName, metav1.GetOptions{})
  if err != nil {
      fmt.Println(err)
      return
  }
  if rc.ObjectMeta.Labels["test-rc"] != "patched" {
      fmt.Println(err)
      return
  }
  fmt.Println("[status] fetched ReplicationController")

  rcStatusUpdatePayload := rc
  rcStatusUpdatePayload.Status.AvailableReplicas = 1
  rcStatusUpdatePayload.Status.ReadyReplicas = 1

  // Replace the ReplicationController's status	
  rcStatus, err = ClientSet.CoreV1().ReplicationControllers(testRcNamespace).UpdateStatus(rcStatusUpdatePayload)
  if err != nil {
      fmt.Println(err)
      return
  }
  if rcStatus.Status.ReadyReplicas != 1 {
      fmt.Println("[error] failed to patch ReplicationController status; ReadyReplicas != 1")
      return
  }
  fmt.Println("[status] updated ReplicationController status")

  fmt.Println("[status] watching for all Replicas to be ready")
  for event := range rcWatchChan {
      rc, ok := event.Object.(*v1.ReplicationController)
      if ok != true {
          fmt.Println("Unable to fix type")
          return
      }
      if rc.Status.Replicas == testRcMaxReplicaCount && rc.Status.ReadyReplicas == testRcMaxReplicaCount {
          fmt.Println("[status] all Replicas are ready")
          break
      }
  }

  rcs, err := ClientSet.CoreV1().ReplicationControllers("").List(metav1.ListOptions{LabelSelector: "test-rc-static=true"})
  if err != nil {
      fmt.Println(err)
      return
  }
  if len(rcs.Items) == 0 {
      fmt.Println("[error] no ReplicationController were found")
  }
  foundRc := false
  for _, rcItem := range rcs.Items {
      if rcItem.ObjectMeta.Name == testRcName &&
         rcItem.ObjectMeta.Namespace == testRcNamespace &&
         rcItem.ObjectMeta.Labels["test-rc-static"] == "true" &&
         rcItem.ObjectMeta.Labels["test-rc"] == "patched" && 
         rcItem.Status.Replicas == testRcMaxReplicaCount &&
         rcItem.Status.ReadyReplicas == testRcMaxReplicaCount {
         foundRc = true
      }
  }
  if foundRc == false {
      fmt.Println("[error] unable to find ReplicationController")
      return
  }
  fmt.Println("[status] retrieved all ReplicationControllers selecting with LabelSelector")

  // Delete ReplicationController
  err = ClientSet.CoreV1().ReplicationControllers(testRcNamespace).DeleteCollection(&metav1.DeleteOptions{}, metav1.ListOptions{LabelSelector: "test-rc-static=true"})
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println("[status] deleted ReplicationController")

  fmt.Println("[status] complete")

}
```

```go
[status] created ReplicationController
[status] watching for all Replicas to be ready
[status] patched ReplicationController
[status] patched status of ReplicationController
[status] fetched ReplicationController status
[status] patched scale of ReplicationController
[status] watching for all Replicas to be ready
[status] fetched ReplicationController
[status] updated ReplicationController status
[status] watching for all Replicas to be ready
[status] all Replicas are ready
[status] retrieved all ReplicationControllers selecting with LabelSelector
[status] deleted ReplicationController
[status] complete
```

```go

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

See all endpoints hit from this test

```sql-mode
select * from endpoints_hit_by_new_test where useragent like 'live%'; 
```

```example
     useragent     |                     operation_id                      | hit_by_ete | hit_by_new_test 
-------------------|-------------------------------------------------------|------------|-----------------
 live-test-writing | createCoreV1NamespacedReplicationController           | t          |               2
 live-test-writing | deleteCoreV1CollectionNamespacedReplicationController | f          |               2
 live-test-writing | listCoreV1NamespacedReplicationController             | t          |               1
 live-test-writing | listCoreV1ReplicationControllerForAllNamespaces       | f          |               1
 live-test-writing | patchCoreV1NamespacedReplicationController            | f          |               2
 live-test-writing | patchCoreV1NamespacedReplicationControllerScale       | f          |               2
 live-test-writing | patchCoreV1NamespacedReplicationControllerStatus      | f          |               2
 live-test-writing | readCoreV1NamespacedReplicationController             | t          |               1
 live-test-writing | readCoreV1NamespacedReplicationControllerStatus       | f          |               1
 live-test-writing | replaceCoreV1NamespacedReplicationControllerStatus    | f          |               2
(10 rows)

```

Display test coverage change

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------|-----------------|--------------|--------------|------------------
 test_coverage |             438 |          190 |          197 |                7
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by 7 points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
