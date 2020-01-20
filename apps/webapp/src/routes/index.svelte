<script context="module">
    import client from "../apollo.js";
    import { gql } from "apollo-boost";
    import { ENDPOINTS } from '../queries';

    export async function preload() {
    return {
        cache: await client.query({query: ENDPOINTS})
    };
    }
</script>

<script>
 import { afterUpdate } from 'svelte';
 import { restore, query } from 'svelte-apollo';
 import {
     endpoints,
     rawMetadata,
     metadata
 } from '../stores';
 import Header from '../components/Header.svelte';
 import Sunburst from '../components/Sunburst.svelte';

 export let cache;

 restore(client, ENDPOINTS, cache.data);
 const endpointsFromQuery = query(client, {query: ENDPOINTS})
 endpoints.set($endpointsFromQuery.data.endpoint_coverage);
 rawMetadata.set($endpointsFromQuery.data.bucket_job_swagger);

 afterUpdate(() => console.log({metadata: $metadata, raw: $rawMetadata, query: $endpointsFromQuery.data}));
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>


<Header />
<Sunburst />
