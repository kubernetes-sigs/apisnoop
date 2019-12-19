<script context="module">
    import client from "../apollo.js";
    import { gql } from "apollo-boost";

    const PROJECTED_CHANGE = gql`
        query stats {
            projected_change_in_coverage {
                new_coverage
                old_coverage
            }
            endpoints_hit_by_new_test{
                operation_id
                hit_by_ete
                hit_by_new_test
            }
        }
    `;
    export async function preload() {
    return {
    cache: await client.query({query: PROJECTED_CHANGE})
    };
    }
</script>

<script>
 import { query } from 'svelte-apollo';
 import ProjectedCoverage from '../components/Projected-Coverage.svelte';
 import EndpointsHitByTest from '../components/Endpoints-Hit-By-Test.svelte';

 const projection = query(client, {query: PROJECTED_CHANGE})
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>

<h1>APISNOOOOOOOOP</h1>
{#await $projection}
    loading stats...
{:then results}
    <ProjectedCoverage results={results.data.projected_change_in_coverage[0]} />
    <EndpointsHitByTest results={results.data.endpoints_hit_by_new_test} />
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

