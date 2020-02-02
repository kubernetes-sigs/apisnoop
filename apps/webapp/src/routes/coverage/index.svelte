<script context="module">
 import client from "../../apollo.js";
 import { ENDPOINTS_TESTS_AND_USERAGENTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE} from '../../queries';
 import { determineBucketAndJob } from '../../lib/helpers.js';

 export async function preload (page, session) {
     let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
     let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;
     let query = page.query;
     let {bucket, job} = determineBucketAndJob(rawBucketsAndJobsPayload);
     let endpointsUseragentsAndTestsFromQuery = await client.query({query: ENDPOINTS_TESTS_AND_USERAGENTS, variables: {bucket, job}});

     return {
         endpointsUseragentsAndTestsFromQuery,
         query,
         rawBucketsAndJobsPayload
     };
 }
</script>

<script>
 import CoverageContainer from '../../components/CoverageContainer.svelte';
 import {
     activeFilters,
     rawBucketsAndJobs,
     endpointsTestsAndUseragents,
 } from '../../stores';

 export let rawBucketsAndJobsPayload;
 export let endpointsUseragentsAndTestsFromQuery;
 export let query;

 rawBucketsAndJobs.set(rawBucketsAndJobsPayload);
 activeFilters.update(af => ({...af, ...query}));
 endpointsTestsAndUseragents.set(endpointsUseragentsAndTestsFromQuery.data);

</script>
<CoverageContainer />
