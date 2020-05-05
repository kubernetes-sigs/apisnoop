- [Ticket status](#sec-1)
- [Current problem](#sec-2)
- [Proposed solution](#sec-3)


# Ticket status<a id="sec-1"></a>

-   [ ] [K8s watch events test tooling #323](https://github.com/cncf/apisnoop/pull/323)
-   [ ] [Watch event test verification tooling #90574](https://github.com/kubernetes/kubernetes/issues/90574)

# Current problem<a id="sec-2"></a>

Watch events may be missed and the test may still pass. We need to ensure that all expected watch events are seen.

Watch events are not collected and checked at the end of the test.

# Proposed solution<a id="sec-3"></a>

In order to solve the problem, we must collect all watch events as they come in and perform a check at the end of the test to ensure that the order is correct and they contain no errors.

```go
package main

import (
  "fmt"
)

func main() {
  expectedWatchEventsAll := [][]string{
    {
      "ADDED",
      "ADDED",
      "DELETED",
    },
    {
      "ADDED",
      "MODIFIED",
      "MODIFIED",
      "DELETED",
    },
    {
      "ADDED",
      "MODIFIED",
      "DELETED",
    },
  }
  for expectedExampleInt, expectedWatchEvents := range expectedWatchEventsAll {
	  fmt.Println("Running example", expectedExampleInt)
    allowedAttempts := 3
    failure := VerifyWatchEventOrder(allowedAttempts, expectedWatchEvents, func() []string {
      var myWatchEvent string
      var watchEvent []string
      fmt.Println("An event takes place (1/3)")
      myWatchEvent = "ADDED"
      watchEvent = append(watchEvent, myWatchEvent)

      fmt.Println("An event takes place (2/3)")
      myWatchEvent = "MODIFIED"
      watchEvent = append(watchEvent, myWatchEvent)

      fmt.Println("An event takes place (3/3)")
      myWatchEvent = "DELETED"
      watchEvent = append(watchEvent, myWatchEvent)

      return watchEvent
    })
    if failure != "" {
      fmt.Println(failure, "watch events occured in the wrong or incorrect order")
    }
    fmt.Println("Check complete")
  }
}

func VerifyWatchEventOrder(retries int, expectedWatchEvents []string, scenario func() []string) (failure string) {
  var attemptContainsFailure bool
attempts:
  for try := 1; try <= retries; try++ {
    if try == retries {
      return failure
    }
    actualWatchEvents := scenario()
    if len(expectedWatchEvents) != len(actualWatchEvents) {
      failure = "expected watch events count does not match the count of actual watch events"
      attemptContainsFailure = true
      continue
    }
    for watchEventInt, watchEvent := range actualWatchEvents {
      if expectedWatchEvents[watchEventInt] != watchEvent {
        failure = fmt.Sprintf("(index %v) %v not found, found %v instead. %v/%v attempts", watchEventInt, expectedWatchEvents[watchEventInt], watchEvent, try, retries)
        attemptContainsFailure = true
      }
    }
    if attemptContainsFailure == false {
      failure = ""
      break attempts
    }
  }
  return failure
}
```

    Running example 0
    An event takes place (1/3)
    An event takes place (2/3)
    An event takes place (3/3)
    An event takes place (1/3)
    An event takes place (2/3)
    An event takes place (3/3)
    (index 1) ADDED not found, found MODIFIED instead. 2/3 attempts watch events occured in the wrong or incorrect order
    Check complete
    Running example 1
    An event takes place (1/3)
    An event takes place (2/3)
    An event takes place (3/3)
    An event takes place (1/3)
    An event takes place (2/3)
    An event takes place (3/3)
    expected watch events count does not match the count of actual watch events watch events occured in the wrong or incorrect order
    Check complete
    Running example 2
    An event takes place (1/3)
    An event takes place (2/3)
    An event takes place (3/3)
    Check complete
