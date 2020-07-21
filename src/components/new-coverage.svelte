<script>
 import { newCoverage } from '../store';
 import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
 import Icon from 'fa-svelte';
 import { orderBy} from 'lodash-es';
 const checkmark = faCheckCircle;

 $: sortedCoverage = $newCoverage;
 $: sorting = 'asc';

 const updateSorting = (key) => {
   sorting = sorting === 'asc'
           ? 'desc'
           : 'asc';
   sortedCoverage = orderBy(sortedCoverage, key, sorting);
 }
</script>

<section id="new-coverage">
<h2>New Coverage</h2>
<table>
  <thead>
    <tr>
      <th on:click="{()=> updateSorting('endpoint')}">Endpoint</th>
      <th on:click="{()=> updateSorting('level')}">Level</th>
      <th on:click="{() => updateSorting('category')}">Category</th>
      <th on:click="{() => updateSorting('test')}">Test</th>
    </tr>
  </thead>
  <tbody>
    {#each sortedCoverage as { release, endpoint, level, category, test }}
      <tr>
        <td>
          <a href={`/${release}/${level}/${category}/${endpoint}`}>{endpoint}</a>
        </td>
        <td>
          <a href={`/${release}/${level}`}>
            {level}
          </a>
        </td>
        <td>
          <a href={`/${release}/${level}/${category}`}>
            {category}
          </a>
        </td>
        <td>
          {test}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
</section>
<style>
 section {
   margin-top: 2rem;
 }
 th {
   cursor: pointer;
   padding-right: 1rem;
 }
 th:hover {
   background: aliceblue;
 }
 td {
   padding-right: 1.25rem;
 }
 td :global(.check) {
   font-size: 1.3em;
   padding-right: 1rem;
   margin-top: 0.1em;
 }
 td :global(.success) {
   color: rgba(60, 180, 75, 1);
 }

 td :global(.fail) {
   color: rgba(233, 203, 233, 1);
 }
</style>
