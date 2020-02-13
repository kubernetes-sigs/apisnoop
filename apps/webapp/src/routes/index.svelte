<script context="module">
 export function preload({ params, query }) {
	 return this.fetch(`index.json`).then(r => r.json()).then(payload => {
		 return { payload };
	 });
 }
</script>

<script>
 import CoverageOverTime from '../components/CoverageOverTime.svelte';
 import { isEqual} from 'lodash-es';
 import { goto } from '@sapper/app';
 export let payload;
 import {
     stableEndpointStats,
     rawBucketsAndJobs,
   } from '../stores';

 rawBucketsAndJobs.update(raw => isEqual(raw, payload.rawBucketsAndJobsPayload)
                                ? raw
                                : payload.rawBucketsAndJobsPayload);

 stableEndpointStats.update(stats => isEqual(stats, payload.stableEndpointStatsPayload)
                                ? stats
                                : payload.stableEndpointStatsPayload);
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>
<CoverageOverTime />
<a href='/coverage/ci-kubernetes-e2e-gci-gce' on:click={() => goto('/coverage/ci-kubernetes-e2e-gci-gce')}>go to coverage</a>

<style>
 ul {
	 margin: 0 0 1em 0;
	 line-height: 1.5;
 }
 section#stats {
   height: 100vh;
 }
</style>

