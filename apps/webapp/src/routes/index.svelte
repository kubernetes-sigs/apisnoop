<script context="module">
    import client from "../apollo.js";
    import { gql } from "apollo-boost";
    import { ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../queries';

    export async function preload() {
    return {
        cache: await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE})
    };
    }
</script>

<script>
 import { afterUpdate } from 'svelte';
 import { restore, query } from 'svelte-apollo';
 import {
     rawMetadata,
     bucketsAndJobs,
     defaultBucketAndJob
 } from '../stores';

 export let cache;

 restore(client, ALL_BUCKETS_AND_JOBS_SANS_LIVE, cache.data);
 const metadataFromQuery = query(client, {query: ALL_BUCKETS_AND_JOBS_SANS_LIVE})
 rawMetadata.set($metadataFromQuery.data.bucket_job_swagger);

 afterUpdate(() => console.log({md: $rawMetadata, bj: $bucketsAndJobs, dbj: $defaultBucketAndJob}));
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>

<em>coverage over time will go here</em>
