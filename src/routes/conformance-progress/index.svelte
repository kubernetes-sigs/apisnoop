<script>
 import {
   conformanceProgressRaw,
   formattedProgress,
   coveragePerReleaseRaw,
   coveragePerRelease
 } from '../../store';

 import Link from '../../components/icons/link-solid.svelte';

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

<h1>Conformance Progress</h1>

<section id="prologue">
  <p>These charts track the progress on conformance coverage for kubernetes stable endpoints.</p>
  <p>In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour).</p>
  <p>We also limit the set to endpoints still around today, excluding historically stable endpoints that have since been deprecrated.</p>
</section>

<section id="coverage-at-time-of-release">
  <h2><a href="conformance-progress#coverage-at-time-of-release">Stable Endpoint Coverage At Time of Release <Link width="1.25rem" /> </a></h2>
<em>In this, we look at endpoints introduced in a release, and how many came in with tests.  We also look at the overall conformance coverage at the time of that release</em>

{#if $formattedProgress.length === 0}
  <p>loading chart...</p>
{:else}
  <StableOverTime data={$formattedProgress} />
{/if}
</section>

<section id="coverage-by-release">
  <h2><a href="conformance-progress#coverage-by-release">Conformance Coverage By Release <Link width="1.25rem"/></a></h2>
<em>In this chart we look at the promoted endpoints in a release, and how many of them are tested or untested today.</em>
<p><b>Note:</b>We mark the number of still untested endpoints as a negative number, since they represent technical debt.</p>

{#if $coveragePerRelease.length === 0}
  <p>loading chart...</p>
{:else}
  <CoveragePerRelease data={$coveragePerRelease} />
{/if}

<p>This report highlights the importance of having a gate that ensures any promoted endpoint comes with a test. This became an initiative in 1.16 and that release has one of the best ratios of introduced to tested. 1.19 is also looking impressive, with nearly 100% coverage on all its new endpoints.</p>
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
