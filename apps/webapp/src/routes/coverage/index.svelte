<script context="module">
 import client from "../../apollo.js";
 import { ENDPOINTS_USERAGENTS_AND_TESTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE} from '../../queries';
 import { get } from 'svelte/store';
 import { defaultBucketAndJob } from '../../stores';

 export async function preload (page, session) {
     let metadata = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE}) 
     let buckets = groupBy(metadata, 'bucket');
     let bj = mapValues(buckets, (allJobs) => {
         let [latestJob] = allJobs
             .sort((a,b) => new Date(b.job_timestamp) > new Date(a.job_timestamp))
             .map(j => ({job: j.job, timestamp: j.job_timestamp}));

         let jobs = allJobs.map(j => ({job: j.job, timestamp: j.job_timestamp}));

         return {
             latestJob,
             jobs
         };
     });
     let releaseBlocking = 'ci-kubernetes-e2e-gci-gce';
     let defaultBucket = Object.keys(bj).includes(releaseBlocking)
                       ? releaseBlocking
                       : Object.keys(bj)[0];

     let defaultBucketAndJob = {
         bucket: defaultBucket,
         job: bj[defaultBucket].latestJob.job,
         timestamp: bj[defaultBucket].latestJob.job_timestamp
     }

     let query = page.query;
     let {bucket, job} = defaultBucketAndJob;
     let endpointsUseragentsAndTestsFromQuery = await client.query({query: ENDPOINTS_USERAGENTS_AND_TESTS, variables: {bucket, job}});

     return {
         bucket,
         job,
         endpointsUseragentsAndTestsFromQuery,
         metadata,
         query
     };
 }
</script>

<script>
 import CoverageContainer from '../../components/CoverageContainer.svelte';
 import { isEmpty } from 'lodash-es';
 import {
     activeBucketAndJob,
     activeFilters,
     allTestsAndTags,
     endpoints,
     rawMetadata,
     allUseragents
 } from '../../stores';

 export let bucket;
 export let job;
 export let endpointsUseragentsAndTestsFromQuery;
 export let metadata;
 export let query;

 activeFilters.update(af => ({...af, ...query}));
 allUseragents.set(endpointsUseragentsAndTestsFromQuery.data.useragents);
 rawMetadata.set(metadata.data.bucket_job_swagger)
 activeBucketAndJob.set({bucket, job});
 endpoints.set(endpointsUseragentsAndTestsFromQuery.data.endpoint_coverage);
 allTestsAndTags.set(endpointsUseragentsAndTestsFromQuery.data.tests);
</script>

<CoverageContainer />


