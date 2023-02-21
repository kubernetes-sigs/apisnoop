<script>
 import { gte } from '../lib/semver.js';
 import { orderBy, partition } from 'lodash-es';

 export let endpoints;

 $: sortedEndpoints = endpoints;

 $: sorting = 'asc';

 const sortByTested = () => {
   let testedUntested = partition(sortedEndpoints, (e) => e.tested_release !== null);
   let tested = testedUntested[0].sort((a,b) => gte(b.tested_release, a.tested_release));
   let untested = testedUntested[1].sort((a,b) => gte(b.promotion_release, a.promotion_release));
   if (sorting === 'asc') {
     sorting = 'desc'
     tested = tested.reverse();
     sortedEndpoints = [...untested, ...tested]
   } else {
     sorting = 'asc'
     sortedEndpoints = [...tested, ...untested]
   }
 };

 const sortByPromotion = () => {
   if (sorting === 'asc') {
     sorting = 'desc'
     sortedEndpoints = sortedEndpoints.sort((a,b) => semver.compare(a.promotion_release, b.promotion_release));
   } else {
     sorting = 'asc'
     sortedEndpoints = sortedEndpoints.sort((a,b) => semver.compare(b.promotion_release, a.promotion_release));
   }
 }

 const sortByEndpoint = () => {
   if (sorting === 'asc') {
     sorting = 'desc'
     sortedEndpoints = orderBy(sortedEndpoints, 'endpoint', 'desc');
   } else {
     sorting = 'asc';
     sortedEndpoints = orderBy(sortedEndpoints, 'endpoint', 'asc');
   }
 }

</script>
<table>
  <thead>
    <tr>
      <th on:click="{sortByEndpoint}">Endpoint</th>
      <th on:click="{sortByPromotion}">Promotion Release</th>
      <th on:click="{sortByTested}">Tested Release</th>
    </tr>
  </thead>
  <tbody>
    {#each sortedEndpoints as {endpoint, colour, promotion_release, tested_release}}
      <tr>
        <td style="border-left: 2px solid {colour};">{endpoint}</td>
        <td class="release">{promotion_release}</td>
        <td class="release tested">
          {#if tested_release}
            {tested_release}
          {:else}
            not tested
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<style>
 thead th {
   padding: 0.25rem;
   border-right: 1px solid gray;
   border-bottom: 1px solid gray;
 }
 tr {
   margin: 0;
 }
 td {
   padding: 0.25rem;
   margin-bottom: none;
   margin-right: 0.5rem;
 }
 td.release {
   text-align: right;
 }
</style>
