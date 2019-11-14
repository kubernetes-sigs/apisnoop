<script>
 export let results;
 $: newCoverage = results.new_coverage;
 $: oldCoverage = results.old_coverage;
 $: increase = newCoverage > oldCoverage;
</script>

<h2>Projected Change in Coverage</h2>
{#if increase}
    <p>This test would increase endpoint coverage, by {newCoverage - oldCoverage} endpoints!</p>
{:else }
    <p>Currently, your test does not increase endpoint coverage.</p>
    <p>This is because it doesn't hit any currently untested endpoints.</p>
{/if}

<style>
 h2 {
     font-weight: 700;
     }
    p {
      font-size: 1em;
      font-style: italic;
    }
</style>
