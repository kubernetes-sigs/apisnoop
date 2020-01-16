<script context='module'>
 import { defaultBucketAndJob, bucketsAndJobs } from '../../../../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../../../../apollo.js";
 import { ENDPOINTS_AND_TESTS } from '../../../../../../queries';

 export async function preload (page, session) {
     let bjs = get(bucketsAndJobs);
     const { bucket, job, level, category } = page.params;

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

     let endpointsAndTagsFromQuery = await client.query({query: ENDPOINTS_AND_TESTS, variables: {bucket: activeBucket, job: activeJob}});
     return {
         endpointsAndTagsFromQuery ,
         activeBucket,
         activeJob,
         invalidBucket,
         invalidJob,
         level,
         category
     };
 };
</script>

<script>
 import { allTestsAndTags, 
endpoints, activeBucketAndJob, activePath } from '../../../../../../stores';
 import { isEmpty } from 'lodash-es';
 import { afterUpdate } from 'svelte';
 import CoverageContainer from '../../../../../../components/CoverageContainer.svelte';

 export let level;
 export let category;
 export let activeBucket;
 export let activeJob;
 export let invalidBucket;
 export let invalidJob;
 export let endpointsAndTagsFromQuery;

 endpoints.set(endpointsAndTagsFromQuery.data.endpoint_coverage);
 console.log({level, category});
 activePath.set([level, category]);
 activeBucketAndJob.set({bucket: activeBucket, job: activeJob});
 allTestsAndTags.set(endpointsAndTagsFromQuery.data.tests);
 endpoints.set(endpointsAndTagsFromQuery.data.endpoint_coverage);
</script>

{#if invalidBucket}
    <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Fetching for <code>{activeBucket}</code> instead.</em></p>
{/if}
{#if invalidJob}
<p><strong>Note: </strong><em>Could not find job <code>{invalidJob}</code> from <code>{activeBucket}</code>.  Displaying latest job instead.</em></p>
{/if}
<CoverageContainer />
