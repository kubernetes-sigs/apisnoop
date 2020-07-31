<script>
 import { confFilters } from '../store/conformance.js';
 import { conformanceColours } from '../lib/colours.js';

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
 }
</script>
<strong>Filter By:</strong>
<ul>
{#each filters as filter}
  {#if filter.value}
    <li style="background: {filter.colour}" on:click="{() => updateFilters(filter.filter)}">{filter.name}</li>
    {:else}
    <li on:click="{() => updateFilters(filter.filter)}">{filter.name}</li>
  {/if}
{/each}
</ul>
