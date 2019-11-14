<script context="module">
    import client from "../apollo.js";
    import { gql } from "apollo-boost";

    const PROJECTED_CHANGE = gql`
    query projected_change {
        projected_change_in_coverage {
            old_coverage
            new_coverage
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
 const projection = query(client, {query: PROJECTED_CHANGE})
</script>

<svelte:head>
    <title>APISnoop</title>
</svelte:head>

<h1>APISnoop!</h1>
<p>i hope you work</p>
{#await $projection}
    loading stats...
{:then results}

    <h2>Projected Change In Coverage</h2>
    <p>Current # of Endpoints covered by tests: {results.data.projected_change_in_coverage[0].old_coverage}</p>
    <p># of endpoints covered with yr test merged: {results.data.projected_change_in_coverage[0].new_coverage}</p>
{/await}



<style>
 h1, p {
     text-align: center;
     margin: 0 auto;
 }

 h1 {
     font-size: 2.8em;
     text-transform: uppercase;
     font-weight: 700;
     margin: 0 0 0.5em 0;
 }

 p {
     margin: 1em auto;
 }

 @media (min-width: 480px) {
     h1 {
         font-size: 4em;
     }
 }
</style>

