<script context="module">
 export function preload({ params, query }) {
   const {release} = params;
   let payload = {
     release
   }
   return {payload};
 }
</script>
<script>
  import { onMount, afterUpdate } from 'svelte';
 import {
   confEndpointsRaw,
   confFilters,
   oldCoveredByNew,
   promotedWithTests,
   tested,
   untested
 } from '../../../store/conformance.js';

 export let payload;
 const endpointsURL = 'https://raw.githubusercontent.com/apisnoop/snoopDB/master/resources/coverage/conformance-endpoints.json'

 let { release } = payload;

 onMount(async() => {
   const endpoints = await fetch(endpointsURL).then(res => res.json())
   confEndpointsRaw.set(endpoints);
 })

 afterUpdate(() => {
   if (release && $confFilters.release !== release) {
     confFilters.update(f => ({...f, release}));
   }
  })

</script>
<h2>you got to the release page for {release} </h2>
<h3>Promoted With Tests({$promotedWithTests.length})</h3>
<ul>
  {#each $promotedWithTests as { endpoint, promotion_release, tested_release}}
    <li>{endpoint}/{promotion_release}/{tested_release}</li>
  {/each}
</ul>
<h3>Old Endpoints Covered by New Tests({$oldCoveredByNew.length})</h3>
<ul>
  {#each $oldCoveredByNew as { endpoint, promotion_release, tested_release}}
    <li>{endpoint}/{promotion_release}/{tested_release}</li>
  {/each}
</ul>
<h3>Untested({$untested.length})</h3>
<ul>
  {#each $untested as { endpoint, promotion_release, tested_release}}
    <li>{endpoint}/{promotion_release}</li>
  {/each}
</ul>
<h3>Tested({$tested.length})</h3>
<ul>
  {#each $tested as { endpoint, promotion_release, tested_release}}
    <li>{endpoint}/{promotion_release}</li>
  {/each}
</ul>
