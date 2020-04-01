<script context="module">
 import { join } from 'lodash-es';
 export function preload ({ params, query }) {
     let path = join(params.coverage, '/');
     return this
         .fetch(`coverage/${path}.json`)
         .then(r => r.json())
         .then(payload => ({ payload }));
 };
</script>

<script>
 import CoverageContainer from '../../components/CoverageContainer.svelte';
 import { onMount, afterUpdate } from 'svelte';
 import {
     activeFilters,
     rawBucketsAndJobs,
     endpointsTestsAndUseragents,
     warnings
 } from '../../stores';
 export let payload;
 const  {
     bucket,
     bucketParam,
     category,
     endpointsTestsAndUseragentsFromQuery,
     job,
     jobParam,
     level,
     operation_id,
     query,
     rawBucketsAndJobsPayload
 } = payload;

 rawBucketsAndJobs.set(rawBucketsAndJobsPayload);
 activeFilters.update(af => (
     {...af, bucket,
     job: job || '',
     level: level || '',
     category: category || '',
     operation_id: operation_id || ''
     , ...query
     }
 ));
 endpointsTestsAndUseragents.set(endpointsTestsAndUseragentsFromQuery.data);
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
<CoverageContainer />
