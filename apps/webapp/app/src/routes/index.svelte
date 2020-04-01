<script context="module">
 export function preload({ params, query }) {
   return this.fetch(`index.json`).then(r => r.json()).then(payload => {
     return { payload };
   });
 }
</script>

<script>
 import CoverageOverTime from '../components/CoverageOverTime.svelte'; 
 import Sunburst from '../components/Sunburst.svelte';
 import { isEqual} from 'lodash-es';
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

 rawBucketsAndJobs.update(raw => isEqual(raw, rawBucketsAndJobsPayload)
                               ? raw
                               : rawBucketsAndJobsPayload);

 stableEndpointStats.update(stats => isEqual(stats, stableEndpointStatsPayload)
                                   ? stats
                                   : stableEndpointStatsPayload);

 endpointsTestsAndUseragents.update(etu => isEqual(etu, endpointsTestsAndUseragentsPayload)
                                         ? etu
                                         : endpointsTestsAndUseragentsPayload);
</script>

<svelte:head>
  <title>APISnoop</title>
</svelte:head>
<CoverageOverTime />
<Sunburst />
<h1>You got a webpage</h1>
