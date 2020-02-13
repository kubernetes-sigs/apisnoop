<script context="module">
 export function preload ({ params, query }) {
     return this
         .fetch(`coverage/[...coverage].json`)
         .then(r => r.json())
         .then(payload => ({ payload }));
 };
</script>

<script>
 import CoverageContainer from '../../components/CoverageContainer.svelte';
 import { afterUpdate } from 'svelte';
 import {
     activeFilters,
     rawBucketsAndJobs,
     endpointsTestsAndUseragents,
 } from '../../stores';
 export let payload;
 const  {
     bucket,
     endpointsTestsAndUseragentsFromQuery,
     job,
     query,
     rawBucketsAndJobsPayload
 } = payload;

 rawBucketsAndJobs.set(rawBucketsAndJobsPayload);
 activeFilters.update(af => ({...af, bucket, job, ...query}));
 endpointsTestsAndUseragents.set(endpointsTestsAndUseragentsFromQuery.data);
</script>

<CoverageContainer />
