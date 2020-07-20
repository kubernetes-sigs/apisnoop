<script>
 import { afterUpdate } from 'svelte';
 import { RELEASES, releasesURL } from '../lib/constants.js';
 import {isEmpty} from 'lodash-es';
 import {
   releases,
   activeFilters,
   activeRelease,
   previousRelease,
   latestVersion
 } from '../store';
 import Sunburst from '../components/sunburst/Wrapper.svelte'

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
     let rel = await fetch(`${releasesURL}/${$latestVersion}.json`).then(res => res.json());
     releases.update(rels => {
       rels[$latestVersion] = rel;
       return rels;
     });
   }
   if (isEmpty($previousRelease.endpoints)) {
     let rel = await fetch(`${releasesURL}/${$previousRelease.release}.json`).then(res => res.json());
     releases.update(rels => {
       rels[$previousRelease.release] = rel;
       return rels;
     });
   }
 });

  </script>

  {#if $activeRelease && $activeRelease.endpoints.length > 0}
  <Sunburst />
  <h2>{$previousRelease.release}</h2>
  <p>previous endpoints: {$previousRelease.endpoints.length}</p>
  {:else}
  <em>loading data...</em>
  {/if}
