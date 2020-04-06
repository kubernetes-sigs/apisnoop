<script context="module">
 export function preload({ params, query }) {
   return this.fetch(`index.json`)
              .then(r => r.json())
              .then(payload => ({ payload }));
 }
</script>

<script>
 import CoverageOverTime from '../components/CoverageOverTime/Wrapper.svelte'; 
 import SunburstContainer from '../components/SunburstContainer.svelte';
 import { isEqual} from 'lodash-es';
 import { goto } from '@sapper/app';
 import {
   stableEndpointStats,
   rawBucketsAndJobs,
   endpointsTestsAndUseragents
 } from '../stores';

 export let payload;
 const {
   rawBucketsAndJobsPayload,
   stableEndpointStatsPayload,
   endpointsTestsAndUseragentsPayload
 } = payload;
 let isLoading = false;

 rawBucketsAndJobs.update(raw => isEqual(raw, rawBucketsAndJobsPayload)
                               ? raw
                               : rawBucketsAndJobsPayload);

 stableEndpointStats.update(stats => isEqual(stats, stableEndpointStatsPayload)
                                   ? stats
                                   : stableEndpointStatsPayload);

 endpointsTestsAndUseragents.update(etu => isEqual(etu, endpointsTestsAndUseragentsPayload)
                                         ? etu
                                         : endpointsTestsAndUseragentsPayload);

 const navigateToDataPoint = async ({bucket, job}) => {
   isLoading = true;
   await goto(`${bucket}/${job}`);
   isLoading = false;
 }
</script>

<svelte:head>
  <title>APISnoop</title>
</svelte:head>
<CoverageOverTime on:dataClick={({detail}) => navigateToDataPoint(detail)}/>
{#if isLoading}
<p>loading sunburst with data...</p>
{:else}
<SunburstContainer />
{/if}
