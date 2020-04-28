- [Current problem](#sec-1)
- [Proposed solution](#sec-2)


# Current problem<a id="sec-1"></a>

Watch events may be missed and the test may still pass. We need to ensure that all expected watch events are seen.

Watch events are not collected and checked at the end of the test.

# Proposed solution<a id="sec-2"></a>

In order to solve the problem, we must collect all watch events as they come in and perform a check at the end of the test to ensure that the order is correct and they contain no errors.

```go
package main

import (
  "fmt"
)

func main () {
  var watchBox []string
  myWatchEvent := ""

  fmt.Println("An event takes place (1/3)")
  myWatchEvent = "ADDED"
  watchBox = append(watchBox, myWatchEvent)

  fmt.Println("An event takes place (2/3)")
  myWatchEvent = "MODIFIED"
  watchBox = append(watchBox, myWatchEvent)

  fmt.Println("An event takes place (3/3)")
  myWatchEvent = "DELETED"
  watchBox = append(watchBox, myWatchEvent)


    (index 2) MODIFIED not found, found DELETED instead watch events occured in the wrong or incorrect order
