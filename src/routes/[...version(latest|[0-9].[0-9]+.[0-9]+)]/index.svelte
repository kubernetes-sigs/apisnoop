<script context="module">
 export async function preload({params, query}) {
   let [version] = params.version;
   let level, category, endpoint;
   let payload = {
     version,
     level,
     category,
     endpoint
   };
   return {payload};
 }
</script>

<script>
 import { afterUpdate } from 'svelte';
 import { releasesURL } from '../../lib/constants.js';
 import {
   releases,
   latestVersion,
   activeFilters,
   activeRelease,
   previousRelease,
   newEndpoints,
   olderNewEndpointsRaw
 } from '../../store';
 import { isEmpty } from 'lodash-es';
 import Sunburst from '../../components/sunburst/Wrapper.svelte'
 import NewEndpoints from '../../components/new-endpoints.svelte';
 import OlderNewEndpoints from '../../components/older-new-endpoints.svelte';

 export let payload;
 $: ({
   version,
   level,
   category,
   endpoint
 } = payload);

 afterUpdate(async() => {
   if (version === 'latest') {
     version = $latestVersion;
   }
   activeFilters.update(af => ({
     ...af,
     version,
     level: level || '',
     category: category || '',
     endpoint: endpoint || ''
   }))
   if ($activeRelease !== 'older' && isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${releasesURL}/${$activeRelease.release}.json`)
       .then(res => res.json());
     releases.update(rels => ({...rels, [$activeRelease.release]: rel}));
   }
   if ($previousRelease !== 'older' && !isEmpty($previousRelease) && isEmpty($previousRelease.endpoints)) {
     let rel = await fetch(`${releasesURL}/${$previousRelease.release}.json`)
       .then(res => res.json());
     releases.update(rels => ({...rels, [$previousRelease.release]: rel}));
   }
   if ($olderNewEndpointsRaw.length === 0) {
     let older = await fetch(`${releasesURL}/new-endpoints.json`)
     .then(res=>res.json());
     olderNewEndpointsRaw.set(older);
   }
 });
</script>

<svelte:head>
  <title>APISnoop | {version}</title>
</svelte:head>

{#if $activeRelease && $activeRelease !== 'older'}
  {#if $activeRelease.endpoints.length > 0}
<Sunburst />
  {#if !isEmpty($previousRelease)}
    <NewEndpoints />
  {/if}
{:else}
<em>Loading Data...</em>
{/if}
{:else}
<h2>{$activeFilters.version}</h2>
<em>This is an older release that we do not have test data for.</em>
<OlderNewEndpoints version={$activeFilters.version} />
{/if}
