<script>
 import { afterUpdate } from 'svelte';
 import { RELEASES, releasesURL } from '../lib/constants.js';
 import {isEmpty} from 'lodash-es';
 import {
   releases,
   activeFilters,
   activeRelease
 } from '../store';
 import Sunburst from '../components/sunburst/Wrapper.svelte'
 let version = RELEASES.sort((a,b) => b.split('.')[1] - a.split('.')[1])[0];

 activeFilters.update(af => ({
   ...af,
   version
 }))

 afterUpdate(async() => {
   activeFilters.update(af => ({
     ...af,
     version,
     level: '',
     category: '',
     endpoint: ''
   }))
   if (isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${releasesURL}/${version}.json`).then(res => res.json());
     releases.update(rels => {
       rels[version] = rel;
       return rels;
     });
   }
 });

  </script>

  {#if $activeRelease && $activeRelease.endpoints.length > 0}
  <Sunburst />
  {:else}
  <em>loading data...</em>
  {/if}
