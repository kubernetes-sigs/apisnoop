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
<h1>You got a webpage</h1>
