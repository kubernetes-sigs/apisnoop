<script>
 import SectionHeader from '../SectionHeader.svelte';
 import { dates, coverage } from '../../stores/coverage-over-time.js';
 import { first, last } from 'lodash-es';
 import { releasePrecision } from '../../lib/helpers.js';
 import dayjs from 'dayjs';

 $: releases = $coverage
   .map(stat => ({release: releasePrecision(stat.release, 2) , date: stat.date}))
   .sort((a,b) => new Date(a.date) - new Date(b.date));
 $: latestRelease = last(releases);
 $: otherReleases = releases
   .filter(release => (
     release.date !== latestRelease.date
     && release.release !== latestRelease.release))

 $: pastReleaseSpread = () => {
   let uniqueReleases = [...new Set(otherReleases)]
     .map(r => r.release);

   return uniqueReleases.length > 1
                                ? ` last ${uniqueReleases.length} releases, from ${first(uniqueReleases)} to ${last(uniqueReleases)}, `
                                : `last release, ${first(uniqueReleases)}`;
 }
 $: latestUpdate = dayjs(latestRelease.date)
   .format('DD MMMM, YYYY');
</script>

<SectionHeader title="Coverage For Stable Endpoints, Over Time">
  <em>Updated on {latestUpdate}</em>
</SectionHeader>

<p>Below shows the testing coverage for stable Kubernetes endpoints (where coverage is defined as the percentage of kubernetes endpoints hit by at least one test during an e2e test suite run).  We show coverage for both standard and conformance tests.
  {#if releases.length > 1}
  The data includes the {pastReleaseSpread()} along with the latest test run for {releasePrecision(latestRelease.release, 2)}.
  {:else}
  The data includes the latest test run for {releasePrecision(latestRelease.release, 2)}.
  {/if}
</p>

<p>The current goal, as reflected in the y-axis,  is to have at least 50% of kubernetes endpoints hit by tests.</p>
<strong>Click on any data point to see that release's coverage in depth</strong>
