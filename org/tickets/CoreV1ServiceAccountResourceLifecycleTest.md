# Identifying an untested feature Using APISnoop

According to this APIsnoop query, there are still some remaining ServiceAccount endpoints which are untested.

```sql-mode
SELECT
  operation_id,
  -- k8s_action,
  -- path,
  -- description,
  kind
  FROM untested_stable_core_endpoints
  where path not like '%volume%'
  and kind like 'ServiceAccount'
  -- and operation_id ilike '%%'
 ORDER BY kind,operation_id desc
 -- LIMIT 25
       ;
```

```example
                  operation_id                  |      kind      
------------------------------------------------|----------------
 patchCoreV1NamespacedServiceAccount            | ServiceAccount
 listCoreV1ServiceAccountForAllNamespaces       | ServiceAccount
 deleteCoreV1CollectionNamespacedServiceAccount | ServiceAccount
(3 rows)

```

# API Reference and feature documentation

-   [Kubernetes API Reference Docs](https://kubernetes.io/docs/reference/kubernetes-api/)
-   [client-go - ServiceAccount](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/ServiceAccount.go)
-   [client-go - Secret](https://github.com/kubernetes/client-go/blob/master/kubernetes/typed/core/v1/secret.go)

# The mock test

## Test outline

1.  Create a ServiceAccount with a static label

2.  Create a Secret

3.  Patch the ServiceAccount with a new Label and a new Secret

4.  Get the ServiceAccount to ensure it's patched

5.  List all ServiceAccounts in all Namespaces find the ServiceAccount(1) ensure that the ServiceAccount is found and is patched

6.  Delete Namespaced ServiceAccount(1) via a Collection with a LabelSelector

7.  Delete the Secret

## Test the functionality in Go

```go
package main

import (
  "encoding/json"
  "fmt"
  "flag"
  "os"
  v1 "k8s.io/api/core/v1"
  // "k8s.io/client-go/dynamic"
  // "k8s.io/apimachinery/pkg/runtime/schema"
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
  // DynamicClientSet, _ := dynamic.NewForConfig(config)
  // podResource := schema.GroupVersionResource{Group: "", Version: "v1", Resource: "pods"}

  testNamespaceName := "default"
  testServiceAccountName := "testserviceaccount"
  testSecretName := "testsecret"

  fmt.Println("creating a ServiceAccount")
  testServiceAccount := v1.ServiceAccount{
      ObjectMeta: metav1.ObjectMeta{
          Name: testServiceAccountName,
          Labels: map[string]string{"test-serviceaccount-static": "true"},
      },
  }
  _, err = ClientSet.CoreV1().ServiceAccounts(testNamespaceName).Create(&testServiceAccount)
  if err != nil {
     fmt.Println(err, "failed to create a ServiceAccount")
     return
  }

  fmt.Println("creating a Secret")
  testSecret := v1.Secret{
      ObjectMeta: metav1.ObjectMeta{
          Name: testSecretName,
      },
      Data: map[string][]byte{
          "test-field": []byte("test-value"),
      },
      Type: "Opaque",
  }
  _, err = ClientSet.CoreV1().Secrets(testNamespaceName).Create(&testSecret)
  if err != nil {
     fmt.Println(err, "failed to create a Secret")
     return
  }

  fmt.Println("patching the ServiceAccount")
  testServiceAccountPatchData, err := json.Marshal(map[string]interface{}{
      "secrets": []map[string]interface{}{{
          "name": testSecretName,
      }},
  })
  if err != nil {
     fmt.Println(err, "failed to marshal JSON patch for the ServiceAccount")
     return
  }
  _, err = ClientSet.CoreV1().ServiceAccounts(testNamespaceName).Patch(testServiceAccountName, types.StrategicMergePatchType, []byte(testServiceAccountPatchData))
  if err != nil {
     fmt.Println(err, "failed to patch the ServiceAccount")
     return
  }

  fmt.Println("finding ServiceAccount in list of all ServiceAccounts (by LabelSelector)")
  serviceAccountList, err := ClientSet.CoreV1().ServiceAccounts("").List(metav1.ListOptions{LabelSelector: "test-serviceaccount-static=true"})
  foundServiceAccount := false
  for _, serviceAccountItem := range serviceAccountList.Items {
      // TODO add more checks
      if serviceAccountItem.ObjectMeta.Name == testServiceAccountName && serviceAccountItem.ObjectMeta.Namespace == testNamespaceName && serviceAccountItem.Secrets[0].Name == testSecretName {
          foundServiceAccount = true
          break
      }
  }
  if foundServiceAccount != true {
     fmt.Println(err, "failed to find the created ServiceAccount")
     return
  }

  fmt.Println("deleting the ServiceAccount")
  err = ClientSet.CoreV1().ServiceAccounts(testNamespaceName).DeleteCollection(&metav1.DeleteOptions{}, metav1.ListOptions{})
  if err != nil {
     fmt.Println(err, "failed to delete the ServiceAccount by Collection")
     return
  }

  fmt.Println("deleting the Secret")
  err = ClientSet.CoreV1().Secrets(testNamespaceName).Delete(testSecretName, &metav1.DeleteOptions{})
  if err != nil {
     fmt.Println(err, "failed to delete the Secret")
     return
  }

  fmt.Println("[status] complete")

}
```

```go
creating a ServiceAccount
creating a Secret
patching the ServiceAccount
finding ServiceAccount in list of all ServiceAccounts (by LabelSelector)
deleting the ServiceAccount
deleting the Secret
[status] complete
```

# Verifying increase it coverage with APISnoop

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
     useragent     |                  operation_id                  | hit_by_ete | hit_by_new_test 
-------------------|------------------------------------------------|------------|-----------------
 live-test-writing | createCoreV1NamespacedSecret                   | t          |               2
 live-test-writing | createCoreV1NamespacedServiceAccount           | t          |               2
 live-test-writing | deleteCoreV1CollectionNamespacedServiceAccount | f          |               2
 live-test-writing | deleteCoreV1NamespacedSecret                   | t          |               2
 live-test-writing | listCoreV1ServiceAccountForAllNamespaces       | f          |               1
 live-test-writing | patchCoreV1NamespacedServiceAccount            | f          |               2
(6 rows)

```

Display endpoint coverage change:

```sql-mode
select * from projected_change_in_coverage;
```

```example
   category    | total_endpoints | old_coverage | new_coverage | change_in_number 
---------------|-----------------|--------------|--------------|------------------
 test_coverage |             445 |          195 |          198 |                3
(1 row)

```

# Final notes

If a test with these calls gets merged, ****test coverage will go up by 3 points****

This test is also created with the goal of conformance promotion.

---

/sig testing

/sig architecture

/area conformance
