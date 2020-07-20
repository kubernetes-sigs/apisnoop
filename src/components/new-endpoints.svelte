<script>
 import { activeFilters, newEndpoints } from '../store';
 import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
 import Icon from 'fa-svelte';
 import { orderBy} from 'lodash-es';
 const checkmark = faCheckCircle;

 $: sortedEndpoints = $newEndpoints;
 $: sorting = 'asc';
 $: f = $activeFilters;

 const updateSorting = (key) => {
   sorting = sorting === 'asc'
           ? 'desc'
           : 'asc';
   sortedEndpoints = orderBy(sortedEndpoints, key, sorting);
 }


</script>

<table>
  <thead>
    <tr>
      <th on:click="{()=> updateSorting('endpoint')}">Endpoint</th>
      <th on:click="{()=> updateSorting('level')}">Level</th>
      <th on:click="{() => updateSorting('category')}">Category</th>
      <th on:click="{() => updateSorting('tested')}">Tested</th>
      <th on:click="{() => updateSorting('conf_tested')}">Conformance Tested</th>
    </tr>
  </thead>
  <tbody>
    {#each sortedEndpoints as {endpoint, level, category, tested, conf_tested}}
      <tr>
        <td>
          <a href={`/${f.version}/${level}/${category}/${endpoint}`}>{endpoint}</a>
        </td>
        <td>
          <a href={`/${f.version}/${level}`}>
            {level}
          </a>
        </td>
        <td>
          <a href={`/${f.version}/${level}/${category}`}>
            {category}
          </a>
        </td>
        <td>
          {#if tested}
            <Icon class='success check' icon={checkmark} />
          {:else}
            <Icon class='check fail' icon={checkmark} />
          {/if}
          <td>
            {#if conf_tested}
              <Icon class='success check' icon={checkmark} />
            {:else}
              <Icon class='check fail' icon={checkmark} />
            {/if}
          </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
 td {
   padding-right: 1.25rem;
 }
 td :global(.check) {
   font-size: 1.3em;
   padding-right: 0.25em;
   margin-top: 0.1em;
 }
 td :global(.success) {
   color: rgba(60, 180, 75, 1);
 }

 td :global(.fail) {
   color: rgba(233, 233, 233, 1);
 }
</style>
