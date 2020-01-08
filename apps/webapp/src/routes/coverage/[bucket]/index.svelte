<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../apollo.js";
 import { ENDPOINTS } from '../../../queries';

 export async function preload (page, session) {
     const { bucket } = page.params; 
     const bjs = get(bucketsAndJobs);

     let activeBucket;
     let invalidBucket;
     if (Object.keys(bjs).includes(bucket)) {
         activeBucket = bucket;
     } else {
         activeBucket = get(defaultBucketAndJob)['bucket']
         invalidBucket = bucket;
     }
     let job = bjs[activeBucket]['latestJob']
     let endpointsFromQuery = await client.query({query: ENDPOINTS, variables: {bucket: activeBucket, job}});
     return { endpointsFromQuery, invalidBucket, activeBucket };
 }
</script>

<script>
 import { endpoints } from '../../../stores';
 import { isEmpty } from 'lodash-es';
 import { afterUpdate } from 'svelte';
 import Sunburst from '../../../components/Sunburst.svelte';
 export let endpointsFromQuery;
 export let invalidBucket;
 export let activeBucket;
 endpoints.set(endpointsFromQuery.data.endpoint_coverage);
</script>


{#if !isEmpty($endpoints)}
    {#if invalidBucket}
        <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Displaying latest job for {activeBucket} instead.</em></p>
    {/if}

    <Sunburst />

{/if}
