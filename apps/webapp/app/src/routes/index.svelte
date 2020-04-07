<script context="module">
 export function preload({ params, query }) {
   return this.fetch(`index.json`)
              .then(r => r.json())
              .then(payload => ({ payload }));
 }
</script>

<script>
 import CoverageOverTime from '../components/CoverageOverTime/Wrapper.svelte'; 
 import Sunburst from '../components/Sunburst/Wrapper.svelte';
 import { isEqual} from 'lodash-es';
 import { goto } from '@sapper/app';
 import {
   activeFilters,
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
 const updatePath = async (event) => {
   let {bucket, job, level, category, operation_id} = event.detail.params;
   activeFilters.update(af => ({...af, ...event.detail.params}));
   let filterSegments = compact([bucket, job, level, category, operation_id]);
   let urlPath = join([...filterSegments], '/');
   let x = window.pageXOffset;
   let y = window.pageYOffset;
   goto(urlPath).then(() => window.scrollTo(x,y));
 }
</script>

<svelte:head>
  <title>APISnoop</title>
</svelte:head>
<CoverageOverTime on:dataClick={({detail}) => navigateToDataPoint(detail)}/>
{#if isLoading}
<p>loading sunburst with data...</p>
{:else}
<Sunburst on:newPathRequest={updatePath} />
{/if}
