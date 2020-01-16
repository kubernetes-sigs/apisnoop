<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../../apollo.js";
 import { ENDPOINTS_AND_TESTS } from '../../../../queries';

 export async function preload (page, session) {
     let bjs = get(bucketsAndJobs);
     const { bucket, job } = page.params;

     // Check whether url params give a bucket that exists in our db
     // If so, pass it along.  Otherwise, use the default bucket.
     // invalid bucket is so we can put in a  notice on the page.
     let bucketIsValid = (bucket) => Object.keys(bjs).includes(bucket);
     let jobIsValid = (bucket, job) => bucket['jobs'].map(j => j.job).includes(job);

     let activeBucket = bucketIsValid(bucket)
                      ? bucket
                      : get(defaultBucketAndJob)['bucket'];

     let invalidBucket = bucketIsValid(bucket)
                       ? null
                       : bucket;

     let activeJob = jobIsValid(bjs[activeBucket], job)
                   ? job
                   : bjs[activeBucket]['latestJob'].job;

     let invalidJob = jobIsValid(bjs[activeBucket], job)
                    ? null
                    : job;

     let endpointsAndTestsFromQuery = await client.query({query: ENDPOINTS_AND_TESTS, variables: {bucket: activeBucket, job: activeJob}});
     return {
         endpointsAndTestsFromQuery ,
         activeBucket,
         activeJob,
         invalidBucket,
         invalidJob
     };
 };
</script>

<script>
 import { allTestsAndTags, endpoints, activeBucketAndJob } from '../../../../stores';
 import { isEmpty } from 'lodash-es';
 import CoverageContainer from '../../../../components/CoverageContainer.svelte';

 export let activeBucket;
 export let activeJob;
 export let invalidBucket;
 export let invalidJob;
 export let endpointsAndTestsFromQuery;

 activeBucketAndJob.set({bucket: activeBucket, job: activeJob});
 endpoints.set(endpointsAndTestsFromQuery.data.endpoint_coverage);
 allTestsAndTags.set(endpointsAndTestsFromQuery.data.tests);
</script>

{#if invalidBucket}
    <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Fetching for <code>{activeBucket}</code> instead.</em></p>
{/if}

{#if invalidJob}
    <p><strong>Note: </strong><em>Could not find job <code>{invalidJob}</code> from <code>{activeBucket}</code>.  Displaying latest job instead.</em></p>
{/if}

<CoverageContainer />
