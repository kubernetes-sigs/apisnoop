<script context="module">
 import { join } from 'lodash-es';
 export function preload ({ params, query }) {
   let path = join(params.params, '/');
   return this
     .fetch(`${path}.json`)
     .then(r => r.json())
     .then(payload => ({ payload }));
 };
</script>

<script>
 import Sunburst from '../components/Sunburst/Wrapper.svelte';
 import CoverageOverTime from '../components/CoverageOverTime/Wrapper.svelte';
 import { goto } from '@sapper/app';
 import { onMount, afterUpdate } from 'svelte';
 import { isEqual, compact } from 'lodash-es';
 import {
   activeFilters,
   endpointsTestsAndUseragents,
   rawBucketsAndJobs,
   stableEndpointStats,
   warnings
 } from '../stores';

 export let payload;
 let isLoading = false;
 const  {
   bucket,
   bucketParam,
   category,
   endpointsTestsAndUseragentsPayload,
   job,
   jobParam,
   level,
   operation_id,
   query,
   rawBucketsAndJobsPayload,
   stableEndpointStatsPayload
 } = payload;

 rawBucketsAndJobs.update(raw => isEqual(raw, rawBucketsAndJobsPayload)
                               ? raw
                               : rawBucketsAndJobsPayload);

 stableEndpointStats.update(stats => isEqual(stats, stableEndpointStatsPayload)
                                   ? stats
                                   : stableEndpointStatsPayload);

 endpointsTestsAndUseragents.update(etu => isEqual(etu, endpointsTestsAndUseragentsPayload)
                                         ? etu
                                         : endpointsTestsAndUseragentsPayload);

 activeFilters.update(af => ({
   ...af,
   bucket,
   job: job || '',
   level: level || '',
   category: category || '',
   operation_id: operation_id || ''
   ,
   ...query
 }));

 onMount(() => {
   console.log('mounted');
   if (bucketParam && bucketParam !== bucket) {
     warnings.update(warnings => ({...warnings, invalidBucket: true}));
   }
   if (jobParam && jobParam !== job) {
     warnings.update(warnings => ({...warnings, invalidJob: true}));
   }
 })
 const navigateToDataPoint = async ({bucket, job}) => {
   isLoading = true;
   activeFilters.update(af => ({...af, bucket, job, level: '', category: '', operation_id: ''}))
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
{#if $warnings.invalidBucket}
<p><strong>Note: </strong><em>Could not find data for <code>{bucketParam}</code>. Displaying latest job for {bucket} instead.</em></p>
<button on:click={() => $warnings.invalidBucket = false}>Got it</button>
{/if}
{#if !$warnings.invalidBucket && $warnings.invalidJob}
<p><strong>Note: </strong><em>Could not find data for <code>{jobParam}</code>. Displaying latest job for {bucket} instead.</em></p>
<button on:click={() => $warnings.invalidJob = false}>Got it</button>
{/if}
<CoverageOverTime on:dataClick={({detail}) => navigateToDataPoint(detail)}/>
{#if isLoading}
<p>loading sunburst with data...</p>
{:else}
<Sunburst on:newPathRequest={updatePath} />
{/if}
