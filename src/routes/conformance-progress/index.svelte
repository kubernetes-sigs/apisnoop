<script>
 import {
   conformanceProgressRaw,
   formattedProgress,
   coveragePerReleaseRaw,
   coveragePerRelease
 } from '../../store';
 import { releasesURL } from '../../lib/constants.js';
 import { onMount } from 'svelte';
 import StableOverTime from '../../components/vega-charts/stable-over-time.svelte';
 import CoveragePerRelease from '../../components/vega-charts/coverage-per-release.svelte';

 onMount(async() => {
   let progressData = await fetch(`${releasesURL}/conformance-progress.json`).then(res => res.json());
   let coverageData = await fetch(`${releasesURL}/conformance-coverage-per-release.json`).then(res=>res.json());
   conformanceProgressRaw.set(progressData);
   coveragePerReleaseRaw.set(coverageData);
 });
 // something
</script>

<svelte:head>
  <title>APISnoop | Conformance Progress</title>
</svelte:head>

<h1>APISnoop Progress reports</h1>

<div id="prologue">
  <p>These charts track the progress on conformance coverage for kubernetes stable endpoints.</p>
  <p>In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour).</p>
  <p>We also limited the set to only endpoints still around today. Historically stable endpoints that have been deprecated were excluded from our dataset.</p>
</div>

<h2>Stable Endpoint Coverage Over Time</h2>
<em>In this, we look at the total endpoints per release and how many came in with tests. We also track the overall testing coverage per release.</em>

{#if $formattedProgress.length === 0}
  <p>loading chart...</p>
{:else}
  <StableOverTime data={$formattedProgress} />
{/if}

<h2>New endpoints per release and their current coverage</h2>
<em>In this chart we look at how many endpoints were promoted per release, and of that group, how many are untested today.</em>

<p><b>Note:</b>We mark the number of still untested endpoints as a negative number, since they represent technical debt.</p>

{#if $coveragePerRelease.length === 0}
  <p>loading chart...</p>
{:else}
  <CoveragePerRelease data={$coveragePerRelease} />
{/if}

<p>This report highlights the importance of having a gate that ensures any promoted endpoint comes with a test. This became an initiative in 1.16 and that release has one of the best ratios of introduced to tested. 1.19 is also looking impressive, with nearly 100% coverage on all its new endpoints.</p>

<style>
 h2 {
   margin-top: 1.5em;
 }
 em {
   margin-bottom: 1.5em;
 }
</style>
