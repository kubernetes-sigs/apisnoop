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
 import { isEmpty } from 'lodash-es';
 import { restore, query } from 'svelte-apollo';
 import {
     endpoints,
     groupedEndpoints,
     opIDs,
     sunburst
 } from '../stores';
 import Sunburst from '../components/Sunburst.svelte';

 export let cache;

 restore(client, ENDPOINTS, cache.data);
 const endpointsFromQuery = query(client, {query: ENDPOINTS})
 endpoints.set($endpointsFromQuery.data.endpoint_coverage);

</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>


<Sunburst />
{#if !isEmpty($opIDs)}
    <ul>
        {#each Object.keys($opIDs) as opID}
            <li>operation: {$opIDs[opID]['operation_id']}</li>
        {/each}
    </ul>
{/if}
{#await $endpointsFromQuery}
    <em>loading</em>
    {:then result} 
        <ul>
        {#each result.data.endpoint_coverage as ep}
            <li>{ep.level}</li>
        {/each}
        </ul>
    {:catch error}
    <p>ERROR: {error}</p>
{/await}


<style>
 p {
     text-align: center;
     margin: 0 auto;
 }
</style>

