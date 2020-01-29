<script context='module'>
 import {
     defaultBucketAndJob,
     bucketsAndJobs } from '../../../../../../../stores';
 import { get } from 'svelte/store';
 import client from "../../../../../../../apollo.js";
 import {ENDPOINTS_USERAGENTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../../../../../../../queries';

 export async function preload (page, session) {
     let bjs = get(bucketsAndJobs);
     const { bucket, job, level, category, endpoint } = page.params;
     const { query } = page;

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

     let metadata = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
     let endpointsUseragentsAndTestsFromQuery = await client.query({query: ENDPOINTS_USERAGENTS_AND_TESTS, variables: {bucket: activeBucket, job: activeJob}});
     return {
         endpointsUseragentsAndTestsFromQuery ,
         activeBucket,
         activeJob,
         invalidBucket,
         invalidJob,
         level,
         category,
         endpoint,
         query
     };
 };
</script>

<script>
 import {
     activeBucketAndJob,
     activeFilters,
     activePath,
     allTestsAndTags,
     endpoints,
     allUseragents,
     rawMetadata
 } from '../../../../../../../stores';
 import CoverageContainer from '../../../../../../../components/CoverageContainer.svelte';

 export let level;
 export let category;
 export let endpoint;
 export let activeBucket;
 export let activeJob;
 export let query;
 export let invalidBucket;
 export let invalidJob;
 export let endpointsUseragentsAndTestsFromQuery;
 export let metadata;

 rawMetadata.set(metadata.data.bucket_job_swagger)
 activeFilters.update((af) => ({...af, ...query}));
 endpoints.set(endpointsUseragentsAndTestsFromQuery.data.endpoint_coverage);
 allTestsAndTags.set(endpointsUseragentsAndTestsFromQuery.data.tests);
 activePath.set([level, category, endpoint]);
 activeBucketAndJob.set({bucket: activeBucket, job: activeJob});
 allUseragents.set(endpointsUseragentsAndTestsFromQuery.data.useragents);
</script>

{#if invalidBucket}
    <p><strong>Note: </strong><em>Could not find data for <code>{invalidBucket}</code>. Fetching for <code>{activeBucket}</code> instead.</em></p>
{/if}
{#if invalidJob}
<p><strong>Note: </strong><em>Could not find job <code>{invalidJob}</code> from <code>{activeBucket}</code>.  Displaying latest job instead.</em></p>
{/if}
<CoverageContainer />
