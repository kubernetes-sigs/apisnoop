<script>
 import {
   conformanceProgressRaw,
   formattedProgress,
   coveragePerReleaseRaw,
   coveragePerRelease,
   conformanceProgressPercentage
 } from '../../store';

 import Link from '../../components/icons/link-solid.svelte';

 import { releasesURL } from '../../lib/constants.js';
 import { onMount } from 'svelte';
 import StableOverTime from '../../components/vega-charts/stable-over-time.svelte';
 import CoveragePerRelease from '../../components/vega-charts/coverage-per-release.svelte';
 import ConformanceProgressPercentage  from '../../components/vega-charts/conformance-progress-percentage.svelte'

 onMount(async() => {
   let progressData = await fetch(`${releasesURL}/conformance-progress.json`).then(res => res.json());
   let coverageData = await fetch(`${releasesURL}/conformance-coverage-per-release.json`).then(res=>res.json());
   conformanceProgressRaw.set(progressData);
   coveragePerReleaseRaw.set(coverageData);
   console.log({percent: $conformanceProgressPercentage});
 });
 // something
</script>

<svelte:head>
  <title>APISnoop | Conformance Progress</title>
</svelte:head>

<h1>Conformance Progress</h1>

<section id="prologue">
  <p>These charts track the progress on conformance coverage for kubernetes stable endpoints.</p>
  <p>In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour).</p>
  <p>We also limit the set to endpoints still around today, excluding historically stable endpoints that have since been deprecrated.</p>
</section>

<section id="coverage-at-time-of-release">
  <h2><a href="conformance-progress#coverage-at-time-of-release">Stable Endpoint Coverage At Time of Release <Link width="1.25rem" /> </a></h2>
  <em>How many endpoints were introduced in a release, and how many came in with tests?  What was the confomrance coverage at the time of this release?</em>

{#if $formattedProgress.length === 0}
  <p>loading chart...</p>
{:else}
  <StableOverTime data={$formattedProgress} />
{/if}
</section>

<section id="conformance-progress-percentage">
  <h2><a href="conformance-progress#conformance-progress-percentage">Stable Endpoint Coverage at Time Of Release(Percentage)<Link width="1.25rem" /> </a></h2>
  <em>What was the percentage of total endpoints hit by conformance tests at the time of release?</em>
  {#if $conformanceProgressPercentage.length === 0}
    <p>loading chart...</p>
  {:else}
    <ConformanceProgressPercentage data={$formattedProgress} />
  {/if}

</section>

<section id="coverage-by-release">
  <h2><a href="conformance-progress#coverage-by-release">Conformance Coverage By Release <Link width="1.25rem"/></a></h2>
  <p>For the endpoints promoted in a release, how many of them are tested as of today?</p>
<p><b>Note:</b>We mark the number of still untested endpoints as a negative number, since they represent technical debt.</p>

{#if $coveragePerRelease.length === 0}
  <p>loading chart...</p>
{:else}
  <CoveragePerRelease data={$coveragePerRelease} />
{/if}
</section>

<style>
 h2 {
   margin-top: 2rem;
   font-size: 1.75rem;
 }
 a {
   text-decoration: none;
 }
 a:hover {
   background: aliceblue;
 }
</style>

