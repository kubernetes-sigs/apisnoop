<script context="module">
 import client from "../../apollo.js";
 import { ENDPOINTS_USERAGENTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE} from '../../queries';
 import { get } from 'svelte/store';
 import { defaultBucketAndJob } from '../../stores';

 export async function preload (page, session) {
     let {bucket, job} = get(defaultBucketAndJob);
     let metadata = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE}) 
     let endpointsUseragentsAndTestsFromQuery = await client.query({query: ENDPOINTS_USERAGENTS_AND_TESTS, variables: {bucket, job}});
     return { bucket, job, endpointsUseragentsAndTestsFromQuery, metadata };
 }
</script>

<script>
 import CoverageContainer from '../../components/CoverageContainer.svelte';
 import { isEmpty } from 'lodash-es';
 import {
     activeBucketAndJob,
     allTestsAndTags,
     endpoints,
     rawMetadata,
     allUseragents
 } from '../../stores';

 export let bucket;
 export let job;
 export let endpointsUseragentsAndTestsFromQuery;
 export let metadata;

 allUseragents.set(endpointsUseragentsAndtestsFromQuery.useragents);
 rawMetadata.set(metadata.data.bucket_job_swagger)
 activeBucketAndJob.set({bucket, job});
 endpoints.set(endpointsUseragentsAndTestsFromQuery.data.endpoint_coverage);
 allTestsAndTags.set(endpointsUseragentsAndTestsFromQuery.data.tests);
</script>


<h1>
    what is happening
</h1>
<CoverageContainer />


