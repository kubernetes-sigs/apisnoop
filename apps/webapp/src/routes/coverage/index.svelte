<script context="module">
 import client from "../../apollo.js";
 import { ENDPOINTS } from '../../queries';
 import { get } from 'svelte/store';
 import { defaultBucketAndJob } from '../../stores';

 export async function preload (page, session) {
     let {bucket, job} = get(defaultBucketAndJob);
     let endpointsFromQuery = await client.query({query: ENDPOINTS, variables: {bucket, job}});
     return { bucket, job, endpointsFromQuery };
 }
</script>

<script>
 import { isEmpty } from 'lodash-es';
 import {
     endpoints,
     activeBucketAndJob,
 } from '../../stores';
 import CoverageContainer from '../../components/CoverageContainer.svelte';

 export let bucket;
 export let job;
 export let endpointsFromQuery;

 activeBucketAndJob.set({bucket, job});
 endpoints.set(endpointsFromQuery.data.endpoint_coverage);
</script>

<CoverageContainer />
