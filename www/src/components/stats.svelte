<script>
  import { getClient, query } from 'svelte-apollo';
  import { gql } from 'apollo-boost';
  import { afterUpdate } from 'svelte';

  const client = getClient();

  const STATS = gql`
  {
    stable_endpoint_stats(where: {job: {_neq: "live"}})
    {
      job
      test_hits
      total_endpoints
      conf_hits
   }
  }
  `

  let stats = query(client, {query: STATS});

  afterUpdate(() => console.log('stats', $stats));
</script>

<h2>These are the stats</h2>
{#await $stats}
loading...
{:then results}
{#each results.data.stable_endpoint_stats as stat}
<h2>Baseline</h2>
<p>{stat.total_endpoints} total endpoints</p>
<p>{stat.test_hits} hit by tests</p>
<p>{stat.conf_hits} hit by conformance tests</p>
{/each}
{:catch error}
Err: {error}
{/await}

