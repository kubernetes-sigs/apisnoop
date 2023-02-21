<script>
 import { RELEASES_URL, EARLIEST_VERSION } from '../lib/constants.js';
 import { onMount, afterUpdate } from 'svelte';
 import { isEmpty, mapValues, groupBy } from 'lodash-es';
 import dayjs from 'dayjs';
 import yaml from 'js-yaml';
 import { gte } from '../lib/semver.js'
 import {
   activeFilters,
   activeRelease,
     releases,
     latestVersion
 } from '../store';

 export let params;
 export let query;

 $: ({
     version,
     level,
     category,
     endpoint
 } = params);

 afterUpdate(async() => {
     if ($releases && isEmpty($releases)) {
         let releasesData = await
         fetch(`${RELEASES_URL}/releases.yaml`)
             .then(res => res.blob())
             .then(blob => blob.text())
             .then(yamlString => yaml.load(yamlString))
             .then(releases => releases.filter(({version}) => gte(version, EARLIEST_VERSION)))
             .then(releases => {
                 return mapValues(groupBy(releases, 'version'),
                                  ([{version, release_date}]) => ({
                                      release: version,
                                      release_date: release_date == '' ? new Date() : release_date,
                                      spec: '',
                                      source: '',
                                      endpoints: [],
                                      tests: []
                 }))
             });
         releases.update(rel => releasesData);
     }
     if (version === 'latest' || version == null) {
         version = $latestVersion;
     };
   activeFilters.update(af => ({
     ...af,
     version,
     level: '',
     category: '',
     endpoint: ''
   }))
   if (isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${version}.json`).then(res => res.json());
     releases.update(rels => {
       rels[version] = rel;
       return rels;
     });
   }
 });

 $: lastUpdate = $activeRelease
               ? dayjs($activeRelease.release_date).format('DD MMMM, YYYY')
               : '';
</script>

<svelte:head>
	<title>APISnoop | About</title>
</svelte:head>
<h1>About APISnoop</h1>

<p>APISnoop tracks the testing and conformance coverage of Kubernetes by analyzing the audit logs created by e2e test runs.</p>
<p>It updates thrice-weekly.  It was last updated on {lastUpdate}</p>

<h2>How We gather our coverage</h2>

<p>For our front page sunburst, we use two data sources:</p>
<ul>
  <li>
    <a href="https://github.com/kubernetes/kubernetes/tree/master/api/openapi-spec">The open api spec for Kubernetes</a>
  </li>
  <li>Audit logs from an e2e test run that was run for this release(<a href="https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs/ci-kubernetes-gce-conformance-latest/1278470809987321859">example test)</a></li>
</ul>

<p>
We spin up a postgres database integrated with some custom data processing tools, and add each audit event to our database, along with every endpoint as defined in the spec.  The audit events show every time an endpoint was hit and the useragent that hit it.  Since 1.12, all tests include their test name in their useragent.  This means we can see if an endoint was hit by seeing if its hit by a useragent with 'e2e.test' in its text string.  Then we can take every endpoint and see whether its hit by e2e tests and e2e tests with '[Conformance]' in their name.  We output these results to json, which we use to build up the sunburst.
</p>

<p>
  Our Conformance Progress page works the same, but we add an additional data source: The list of all conformance tests, as outlined in <a href="https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/conformance.yaml">test/conformance/testdata/conformance.yaml</a>
</p>
<p>
This file includes the release in which the test was promoted to conformance.  We take the api specs from 1.9 onward, and see when an endpoint first appeared in them.  Then we sort all the conformance tests that hit it by their release date and use the first test to determine when the endpoint was first conformance tested.
</p>
<p>
As Conformance is concerned with stable(or generally available) endpoints, we focus our progress reports to this same set.  Specifically, we only look at endpoints that are stable as of this last release and that are eligible for Conformance.  Because of this, there may be some difference in numbers from this page and the sunburst, as the Sunburst shows all endpoints for a release, including those that have since been deprecated.
</p>
<h2>Additional Resources</h2>
<ul>
    <li><a href="https://docs.google.com/document/d/1W31nXh9RYAb_VaYkwuPLd1hFxuRX3iU0DmaQ4lkCsX8/edit?pli=1" target="_blank" rel="noreferrer noopener">Conformance Office Hours Meeting Notes</a></li>
    <li><a href="https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/writing-good-e2e-tests.md">Writing good e2e tests for Kubernetes</a></li>
  <li>
    <a href="https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md"> Kubernetes Documentation on Conformance Testing</a></li>
  <li><a href="https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md#conformance-test-requirements">The Conformance Test  Requirements</a></li>
</ul>
