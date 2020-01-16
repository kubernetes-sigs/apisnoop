<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../apollo.js";
 import { ENDPOINTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../../../queries';

 export async function preload (page, session) {
     const { bucket } = page.params; 

     const bjs = get(bucketsAndJobs);

     let bucketIsValid = (bucket) => Object.keys(bjs).includes(bucket);

     let activeBucket = bucketIsValid(bucket)
                      ? bucket
                      : get(defaultBucketAndJob)['bucket'];

     let invalidBucket = bucketIsValid(bucket)
                       ? null
                       : bucket;

     let job = bjs[activeBucket]['latestJob'].job

     let endpointsAndTestsFromQuery = await client.query({query: ENDPOINTS_AND_TAGS, variables: {bucket: activeBucket, job}});

     return { endpointsAndTestsFromQuery, invalidBucket, activeBucket, job };
 }
</script>

<script>
 import { isEmpty } from 'lodash-es';
 import { endpoints,
          allTestsAndTags,
        activeBucketAndJob } from '../../../stores';
 import CoverageContainer from '../../../components/CoverageContainer.svelte';

 export let endpointsAndTestsFromQuery;
 export let invalidBucket;
 export let activeBucket;
 export let job;

 allTestsAndTags.set(endpointsAndTestsFromQuery.data.tests)
 activeBucketAndJob.set({bucket: activeBucket, job});
 endpoints.set(endpointsAndTestsFromQuery.data.endpoint_coverage);
</script>


{#if invalidBucket}
    <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Displaying latest job for {activeBucket} instead.</em></p>
{/if}

<CoverageContainer />
