<script>
 import SectionHeader from './SectionHeader.svelte';
 import CoverageOverTime from './CoverageOverTime.svelte';
 import { dates, coverage } from '../stores/coverage-over-time.js';
 import { first, last } from 'lodash-es';
 import { releasePrecision } from '../lib/helpers.js';
 import dayjs from 'dayjs';

 $: releases = $coverage
   .map(stat => ({release: stat.release , date: stat.date}))
   .sort((a,b) => new Date(a.date) - new Date(b.date));

 $: latestRelease = last(releases);
 $: latestUpdate = dayjs(latestRelease.date)
   .format('DD MMMM, YYYY');

 $: otherReleases = releases
   .filter(release => (
     release.date !== latestRelease.date
     && release.release !== latestRelease.release))
 $: test = releasePrecision(latestRelease.release, 2)
 $: pastReleaseSpread = () => {
   let uniqRels = [...new Set(otherReleases.map(r => releasePrecision(r.release, 2)))];
   return uniqRels.length > 1
                          ? `last ${uniqRels.length} releases, from ${first(uniqRels)} to ${last(uniqRels)}, `
                          : `last release, ${uniqRels[0]}`
 }
</script>

<section>
  <SectionHeader title="Kubernetes Test Coverage Over Time">
    <em>Updated on {latestUpdate}</em>
  </SectionHeader>
  <p>
    Below shows the the testing coverage for standard and conformance tests (where coverage is defined as the percentage of kubernetes endpoints hit by at least one test during an e2e test suite run).
    {#if releases.length > 1}
    The data includes the {pastReleaseSpread()} along with the latest test run for {releasePrecision(latestRelease.release, 2)}.
    {:else}
    The data includes the latest test run for {releasePrecision(latestRelease.release, 2)}.
    {/if}
  </p>

  <p>The current goal, as reflected in the y-axis,  is to have at least 50% of kubernetes endpoints hit by tests.</p>
  <strong>Click on any data point to see an in-depth look at that release's coverage</strong>
  <CoverageOverTime />
</section>

<style>
 section {
   padding: 1rem;
 }
</style>
