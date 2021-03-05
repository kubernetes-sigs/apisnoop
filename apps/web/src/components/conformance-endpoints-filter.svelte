<script>
 import { confFilters } from '../store/conformance.js';
 import { conformanceColours } from '../lib/colours.js';
 import { trimEnd } from 'lodash-es';
 import page from 'page';

 $: filters = [
   {
     name: 'Promoted With Tests',
     filter: 'promotedWithTests',
     value: $confFilters.promotedWithTests,
     colour: conformanceColours.promotedWithTests
   },
   {
     name: 'Promoted Without Tests',
     filter: 'promotedWithoutTests',
     value: $confFilters.promotedWithoutTests,
     colour: conformanceColours.promotedWithoutTests
   },
   {
     name: 'Old Endpoints Covered By New Tests',
     filter: 'oldCoveredByNew',
     value: $confFilters.oldCoveredByNew,
     colour: conformanceColours.oldCoveredByNew
   },
   {
     name: 'Tested',
     filter: 'tested',
     value: $confFilters.tested,
     colour: conformanceColours.tested
   },
   {
     name: 'Untested',
     filter: 'untested',
     value: $confFilters.untested,
     colour: conformanceColours.untested
   },
 ]

 const updateFilters = (filter) => {
   confFilters.update(cf => ({...cf, [filter]: !cf[filter]}));
   const activeFilters = Object.keys($confFilters).filter(k => k !== 'release' && $confFilters[k] === true);
   const filterPath= trimEnd(activeFilters.map(f => `filter=${f}&`).join(''), '&');
   if (filterPath !== '') {
     page(`/conformance-progress/endpoints/${$confFilters.release}/?${filterPath}`);
   } else {
     page(`/conformance-progress/endpoints/${$confFilters.release}/`);
   }
 }
</script>
<strong>Filtered By:</strong>
<ul>
{#each filters as filter}
  {#if filter.value}
    <li style="background: {filter.colour}" on:click="{() => updateFilters(filter.filter)}">{filter.name}</li>
    {:else}
    <li on:click="{() => updateFilters(filter.filter)}">{filter.name}</li>
  {/if}
{/each}
</ul>

<style>
  ul {
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  }
 li {
  padding: 0.5rem;
  font-size: 1.1rem;
   display: inline;
   list-style-type: none;
   cursor: pointer;
 }
 li:hover {
   background: aliceblue;
 }
</style>
