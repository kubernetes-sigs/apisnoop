<script>
 import { onMount } from 'svelte';
 import {
   stableCoverageAtReleaseRaw,
   coverageByReleaseRaw,
 } from '../../store';
 import Link from '../../components/icons/link-solid.svelte';
 import { releasesURL } from '../../lib/constants.js';

 import StableCoverageAtRelease from '../../components/vega-charts/stable-coverage-at-release.svelte';
 import CoverageByRelease from '../../components/vega-charts/coverage-by-release.svelte';

 onMount(async() => {
   let progressData = await fetch(`${releasesURL}/conformance-progress.json`).then(res => res.json());
   let coverageData = await fetch(`${releasesURL}/conformance-coverage-per-release.json`).then(res=>res.json());
   stableCoverageAtReleaseRaw.set(progressData);
   coverageByReleaseRaw.set(coverageData);
 });
</script>

<svelte:head>
  <title>APISnoop | Conformance Progress</title>
</svelte:head>

<h1>Conformance Progress Charts</h1>

<section id="prologue">
  <em>The history of conformance coverage for kubernetes stable endpoints, and where we are at today.</em>
  <p><b>Note:</b> These charts are focused to endpoints that exist today and are eligible for conformance.  Because of this, the numbers will be different from our main page, as that page includes ineligible endpoints.  To see what is excluded, check out <a href="conformance-progress/ineligible-endpoints">our list of ineligible endpoints</a>.</p>
</section>

<StableCoverageAtRelease />
<CoverageByRelease />


<style>
 h2 {
   margin-top: 2rem;
   font-size: 1.75rem;
 }
 a:hover {
   background: aliceblue;
 }
</style>

