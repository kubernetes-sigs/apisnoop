<script>
 import { onMount, afterUpdate } from 'svelte';
 import { RELEASES, RELEASES_URL } from '../lib/constants.js';
 import {isEmpty} from 'lodash-es';
 import {
   activeFilters,
   activeRelease,
   latestVersion,
   newEndpoints,
   olderNewEndpointsRaw,
   previousRelease,
   releases
 } from '../store';
 import Sunburst from '../components/sunburst/Wrapper.svelte'
 import NewEndpoints from '../components/new-endpoints.svelte';

 export let params;

 $: ({
   version,
   level,
   category,
   endpoint
     } = params);

 afterUpdate(async() => {
   if (version === 'latest' || version == null) {
    version = $latestVersion;
   };
   activeFilters.update(af => ({
     ...af,
     version,
     level: level || '',
     category: category || '',
     endpoint: endpoint || ''
   }))
   if ($activeRelease !== 'older' && isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${$activeRelease.release}.json`)
       .then(res => res.json());
     releases.update(rels => ({...rels, [$activeRelease.release]: rel}));
   }
   if ($previousRelease !== 'older' && !isEmpty($previousRelease) && isEmpty($previousRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${$previousRelease.release}.json`)
       .then(res => res.json());
     releases.update(rels => ({...rels, [$previousRelease.release]: rel}));
   }
   if ($olderNewEndpointsRaw.length === 0) {
     let older = await fetch(`${RELEASES_URL}/new-endpoints.json`)
     .then(res=>res.json());
     olderNewEndpointsRaw.set(older);
   }
 });
  </script>

  {#if $activeRelease && $activeRelease.endpoints.length > 0}
    <Sunburst />
    <NewEndpoints />
  {:else}
  <em>loading data...</em>
  {/if}
