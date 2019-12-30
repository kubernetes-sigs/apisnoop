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
 import { endpoints, opIDs } from '../stores';
 import { afterUpdate } from 'svelte';
 export let cache;

 restore(client, ENDPOINTS, cache.data);
 const endpointsFromQuery = query(client, {query: ENDPOINTS})
 endpoints.set($endpointsFromQuery.data.endpoint_coverage);

 afterUpdate(() => console.log({ops: $opIDs}));
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>

<h1>APISNOOOOOOOOP</h1>
{#if !isEmpty($opIDs)}
    <ul>
        {#each Object.keys($opIDs) as opID}
            <li>opeartion: {$opIDs[opID]['operation_id']}</li>
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
 h1, p {
     text-align: center;
     margin: 0 auto;
 }

 h1 {
     font-size: 1.8em;
     text-transform: uppercase;
     font-weight: 700;
     margin: 0 0 0.5em 0;
 }

 @media (min-width: 480px) {
     h1 {
        font-size: 2em;
     }
 }
</style>

