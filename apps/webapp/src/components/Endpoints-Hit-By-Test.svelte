<script>
 export let results;
</script>


{#if results.length > 0}
<h2>Endpoints hit by your test</h2>
<aside>currently untested endpoints highlighted in green</aside>
{#each results as endpoint}
    <ul>
    {#if (endpoint.hit_by_ete > 0)}
        <li>{endpoint.operation_id}</li>
    {:else}
        <li class="unhit">{endpoint.operation_id}</li>
    {/if}
    </ul>
{/each}
{/if}
<style>
 p {
     font-size: 1.4em;
     font-weight: bold;
 }
 aside {
     font-style: italic;
     }

 h2 {
     font-weight: 500;
     }
 .unhit{color: green;}
</style>
