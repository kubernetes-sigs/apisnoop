<script context="module">
 import client from "../../apollo.js";
 import { ENDPOINTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE} from '../../queries';
 import { get } from 'svelte/store';
 import { defaultBucketAndJob } from '../../stores';

 export async function preload (page, session) {
     let {bucket, job} = get(defaultBucketAndJob);
     let metadata = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE}) 
     let endpointsAndTestsFromQuery = await client.query({query: ENDPOINTS_AND_TESTS, variables: {bucket, job}});
     return { bucket, job, endpointsAndTestsFromQuery, metadata };
 }
</script>

<script>
 import { isEmpty } from 'lodash-es';
 import {
     allTestsAndTags,
     rawMetadata,
     endpoints,
     activeBucketAndJob,
 } from '../../stores';
 import CoverageContainer from '../../components/CoverageContainer.svelte';

 export let bucket;
 export let job;
 export let endpointsAndTestsFromQuery;
 export let metadata;

 rawMetadata.set(metadata.data.bucket_job_swagger)

 activeBucketAndJob.set({bucket, job});
 endpoints.set(endpointsAndTestsFromQuery.data.endpoint_coverage);
 allTestsAndTags.set(endpointsAndTestsFromQuery.data.tests);
</script>

<CoverageContainer />
