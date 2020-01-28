<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../apollo.js";
 import { ENDPOINTS_USERAGENTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../../../queries';

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
     let query = page.query;

     let endpointsUseragentsAndTestsFromQuery = await client.query({query: ENDPOINTS_USERAGENTS_AND_TESTS, variables: {bucket: activeBucket, job}});

     return {
         endpointsUseragentsAndTestsFromQuery,
         invalidBucket,
         activeBucket,
         job,
         query
     };
 }
</script>

<script>
 import { isEmpty } from 'lodash-es';
 import {
     activeBucketAndJob,
     activeFilters,
     allTestsAndTags,
     endpoints,
     allUseragents
 } from '../../../stores';

 import CoverageContainer from '../../../components/CoverageContainer.svelte';

 export let endpointsUseragentsAndTestsFromQuery;
 export let invalidBucket;
 export let activeBucket;
 export let job;
 export let query;

 activeFilters.update(af => ({...af, ...query}));
 allUseragents.set(endpointsUseragentsAndtestsFromQuery.useragents);
 allTestsAndTags.set(endpointsUseragentsAndTestsFromQuery.data.tests)
 activeBucketAndJob.set({bucket: activeBucket, job});
 endpoints.set(endpointsUseragentsAndTestsFromQuery.data.endpoint_coverage);

</script>


{#if invalidBucket}
    <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Displaying latest job for {activeBucket} instead.</em></p>
{/if}

<CoverageContainer />
