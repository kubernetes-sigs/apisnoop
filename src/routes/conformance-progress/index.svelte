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

<h1>Conformance Progress</h1>

<section id="prologue">
  <p>These charts track the progress on conformance coverage for kubernetes stable endpoints.</p>
  <p>In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour).</p>
  <p>We also limit the set to endpoints still around today, excluding historically stable endpoints that have since been deprecrated.</p>
</section>

<StableCoverageAtRelease />
<CoverageByRelease />


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

