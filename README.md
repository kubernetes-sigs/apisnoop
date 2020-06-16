# Snoop
[instantinfrastructure.com/snoop](https://instantinfrastructure.com/snoop)

This is a slimmed down version of [APISnoop](https://apisnoop.cncf.io),  designed to generate one-off reports tracking the progress and details of kubernetes conformance testing coverage.

The data is generated in postgres, using queries outlined in org files.  You can track this in the `snoop` folder.

These data sets are then converted to json and ,using vega, turned into html pages stored in our `docs/` folder.  We do this with a viz tool built with clojure, stored in our `viz` folder.

These generated reports can then be read at [instantinfrastructure.com/snoop](https://instantinfrastructure.com/snoop)
