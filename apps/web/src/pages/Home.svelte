<script>
 import { afterUpdate } from 'svelte';
 import { RELEASES, RELEASES_URL } from '../lib/constants.js';
 import {isEmpty} from 'lodash-es';
 import {
   releases,
   activeFilters,
   activeRelease,
   previousRelease,
   newEndpoints,
   latestVersion
 } from '../store';
 // import Sunburst from '../components/sunburst/Wrapper.svelte'
 // import NewEndpoints from '../components/new-endpoints.svelte';

 activeFilters.update(af => ({
   ...af,
   version: $latestVersion
 }))

 afterUpdate(async() => {
   activeFilters.update(af => ({
     ...af,
     version: $latestVersion,
     level: '',
     category: '',
     endpoint: ''
   }))
   if (isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${$latestVersion}.json`).then(res => res.json());
     releases.update(rels => {
       rels[$latestVersion] = rel;
       return rels;
     });
   }
   if (isEmpty($previousRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${$previousRelease.release}.json`).then(res => res.json());
     releases.update(rels => {
       rels[$previousRelease.release] = rel;
       return rels;
     });
   }
 });

  </script>

  {#if $activeRelease && $activeRelease.endpoints.length > 0}
    <h1>ACTIVE RELEASE GO!</h1>
    <!-- <Sunburst />
         <NewEndpoints /> -->
  {:else}
  <em>loading data...</em>
  {/if}
