<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../../apollo.js";
 import { ENDPOINTS } from '../../../../queries';

 export async function preload (page, session) {
     let bjs = get(bucketsAndJobs);
     const { bucket, job } = page.params;
     let activeBucket;
     let activeJob;
     let invalidBucket;
     let invalidJob;

     if (Object.keys(bjs).includes(bucket)) {
         activeBucket = bucket;
     } else {
         invalidBucket = bucket;
         activeBucket = get(defaultBucketAndJob)['bucket'];
     };

     if (bjs[activeBucket]['jobs'].map(j=> j.job).includes(job)) {
         activeJob = job;
     } else {
         invalidJob = job;
         activeJob = bjs[activeBucket]['latestJob'];
     };

     let endpointsFromQuery = await client.query({query: ENDPOINTS, variables: {bucket: activeBucket, job: activeJob}});
     return {
         endpointsFromQuery ,
         activeBucket,
         activeJob,
         invalidBucket,
         invalidJob
     };
 };
</script>

<script>
 import { endpoints } from '../../../../stores';
 import { isEmpty } from 'lodash-es';
 import { afterUpdate } from 'svelte';
 import Sunburst from '../../../../components/Sunburst.svelte';

 export let activeBucket;
 export let activeJob;
 export let invalidBucket;
 export let invalidJob;
 export let endpointsFromQuery;

 endpoints.set(endpointsFromQuery.data.endpoint_coverage);
 afterUpdate(() => console.log({endpointsFromQuery, activeJob, activeBucket, endpoints: $endpoints }));
</script>

{#if !isEmpty($endpoints)}
    {#if invalidBucket}
        <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Fetching for <code>{activeBucket}</code> instead.</em></p>
    {/if}
    {#if invalidJob}
    <p><strong>Note: </strong><em>Could not find job <code>{invalidJob}</code> from <code>{activeBucket}</code>.  Displaying latest job instead.</em></p>
    {/if}
<Sunburst />
{/if}
