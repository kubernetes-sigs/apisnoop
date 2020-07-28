<script>
 import { olderNewEndpoints } from '../store';
 export let version;
 $: endpoints = $olderNewEndpoints[version]
              ? $olderNewEndpoints[version].endpoints.sort()
              : []
</script>

<h2>Endpoints Introduced in this Release</h2>
  <ul>
    {#each endpoints as endpoint}
      <li>{endpoint} </li>
    {/each}
  </ul>
</table>
</section>
<style>
 h2 {
   margin-top: 1.5rem;
 }
 ul {
   list-style-type: none;
 }
</style>
