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
 import SunburstContainer from '../components/SunburstContainer.svelte';
 import CoverageOverTime from '../components/CoverageOverTime.svelte';
 import { onMount, afterUpdate } from 'svelte';
 import { isEqual } from 'lodash-es';
 import {
   activeFilters,
   endpointsTestsAndUseragents,
   rawBucketsAndJobs,
   stableEndpointStats,
   warnings
 } from '../stores';

 export let payload;
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
   console.log({payload});
   if (bucketParam && bucketParam !== bucket) {
     warnings.update(warnings => ({...warnings, invalidBucket: true}));
   }
   if (jobParam && jobParam !== job) {
     warnings.update(warnings => ({...warnings, invalidJob: true}));
   }
 })
</script>
{#if $warnings.invalidBucket}
<p><strong>Note: </strong><em>Could not find data for <code>{bucketParam}</code>. Displaying latest job for {bucket} instead.</em></p>
<button on:click={() => $warnings.invalidBucket = false}>Got it</button>
{/if}
{#if !$warnings.invalidBucket && $warnings.invalidJob}
<p><strong>Note: </strong><em>Could not find data for <code>{jobParam}</code>. Displaying latest job for {bucket} instead.</em></p>
<button on:click={() => $warnings.invalidJob = false}>Got it</button>
{/if}
<CoverageOverTime />
<SunburstContainer />
