<script context="module">
 export const preload = ({ page, params, query }) => {
   const payload = {query}
   return {payload};
 };
</script>
<script>
 import { onMount } from 'svelte';
 import { goto } from '@sapper/app';
 import { trimEnd } from 'lodash-es';

 import {
   stableCoverageAtReleaseRaw,
   coverageByReleaseRaw,
 } from '../../store';
 import { releasesURL } from '../../lib/constants.js';

 import Link from '../../components/icons/link-solid.svelte';
 import StableCoverageAtRelease from '../../components/vega-charts/stable-coverage-at-release.svelte';
 import CoverageByRelease from '../../components/vega-charts/coverage-by-release.svelte';

 export let payload;
 let { query } = payload;

 $: stablechart = query.stablechart || 'number';
 $: relchart = query.relchart || 'number';

 const switchType = (event) => {
   let { chart, type } = event.detail;
   let x = window.pageXOffset;
   let y = window.pageYOffset;
   query = {...query, [chart]: type};
   const queryParams = Object.keys(query);
   const queryParamsPath = trimEnd(queryParams.map(qp => `${qp}=${query[qp]}&`).join(''), '&');
   goto(`/conformance-progress?${queryParamsPath}`).then(()=> window.scrollTo(x,y));
 };

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

<StableCoverageAtRelease chartType={stablechart} on:CHART_TYPE_SWITCHED="{switchType}" />
<CoverageByRelease chartType={relchart} on:CHART_TYPE_SWITCHED="{switchType}" />


<style>
 h2 {
   margin-top: 2rem;
   font-size: 1.75rem;
 }

 a:hover {
   background: aliceblue;
 }

</style>

