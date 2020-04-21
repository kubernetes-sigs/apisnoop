# Progress <code>[0/4]</code>

-   [ ] mock ticket
-   [ ] issue created
-   [ ] PR created
-   [ ] promotion created

# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining Node endpoints which are untested.

```sql-mode
SELECT
  operation_id,
  -- k8s_action,
  -- path,
  -- description,
  kind
  FROM untested_stable_core_endpoints
  -- FROM untested_stable_endpoints
  where path not like '%volume%'
  and kind like 'Node'
  -- and operation_id ilike '%%'
 ORDER BY kind,operation_id desc
 LIMIT 25
       ;
```

```example
        operation_id        | kind 
----------------------------|------
 replaceCoreV1NodeStatus    | Node
 readCoreV1NodeStatus       | Node
 patchCoreV1NodeStatus      | Node
 deleteCoreV1Node           | Node
 deleteCoreV1CollectionNode | Node
 createCoreV1Node           | Node
(6 rows)

```

# API Reference and feature documentation

# The mock test

## Test outline

1.  Create a Node with a static label

2.  Patch the Node with a new label and updated data

3.  Get the Node to ensure it's patched

4.  List all Nodes in all Namespaces with a static label find the Node ensure that the Node is found and is patched

5.  Delete Namespaced Node via a Collection with a LabelSelector

## Test the functionality in Go

```go
package main

import (
  // "encoding/json"
  "fmt"
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
      fmt.Println(err)
      return
  }
  // make our work easier to find in the audit_event queries
  config.UserAgent = "live-test-writing"
  // creates the clientset
  ClientSet, _ := kubernetes.NewForConfig(config)
  // DynamicClientSet, _ := dynamic.NewForConfig(config)
  // nodeResource := schema.GroupVersionResource{Group: "", Version: "v1", Resource: "nodes"}

  // TEST BEGINS HERE

  testNodeName := "test-node"
  // testNodeImage := "nginx"
  // testNamespaceName := "default"

  fmt.Println("creating a Node")
  testNode := v1.Node{
    ObjectMeta: metav1.ObjectMeta{
      Name: testNodeName,
      Labels: map[string]string{"test-node-static": "true"},
    },
   // Spec: v1.NodeSpec{
   //   Containers: []v1.Container{{
   //     Name: testNodeName,
   //     Image: testNodeImage,
   //   }},
   // },
  }
  _, err = ClientSet.CoreV1().Nodes().Create(&testNode)
  if err != nil {
      fmt.Println(err, "failed to create Node")
      return
  }

  fmt.Println("listing Nodes")
  nodes, err := ClientSet.CoreV1().Nodes().List(metav1.ListOptions{LabelSelector: "test-node-static=true"})
  if err != nil {
      fmt.Println(err, "failed to list Nodes")
      return
  }
  nodeCount := len(nodes.Items)
  if nodeCount == 0 {
      fmt.Println("there are no Nodes found")
      return
  }
  fmt.Println(nodeCount, "Node(s) found")

  fmt.Println("deleting Node")
  err = ClientSet.CoreV1().Nodes().Delete(testNodeName, &metav1.DeleteOptions{})
  if err != nil {
      fmt.Println(err, "failed to delete the Node")
      return
  }

  // TEST ENDS HERE

  fmt.Println("[status] complete")

}
```

```go
creating a Node
listing Nodes
1 Node(s) found
deleting Node
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
     useragent     |   operation_id   | hit_by_ete | hit_by_new_test 
-------------------|------------------|------------|-----------------
 live-test-writing | createCoreV1Node | f          |               2
 live-test-writing | deleteCoreV1Node | f          |               2
 live-test-writing | listCoreV1Node   | t          |               2
(3 rows)

```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------|-----------------|--------------|--------------|------------------
 test_coverage |             445 |          192 |          194 |                2
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by N points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
