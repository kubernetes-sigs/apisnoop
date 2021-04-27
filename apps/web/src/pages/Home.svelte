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
 import {
     confEndpointsRaw
 } from '../store/conformance.js';
 import Sunburst from '../components/Sunburst/Wrapper.svelte'
 import NewEndpoints from '../components/new-endpoints.svelte';

 export let params;
 export let query;

 console.log({query})
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
         endpoint: endpoint || '',
         conformanceOnly: query["conformance-only"]
                        ? query["conformance-only"].toLowerCase() === "true"
                        : false
     }))

     if ($activeRelease !== 'older' && isEmpty($activeRelease.endpoints)) {
         let rel = await fetch(`${RELEASES_URL}/${$activeRelease.release}.json`)
             .then(res => res.json());
         releases.update(rels => ({...rels, [$activeRelease.release]: rel}));
     }
     if ($confEndpointsRaw && isEmpty($confEndpointsRaw)) {
         const conformanceEndpoints = await fetch(`${RELEASES_URL}/conformance-endpoints.json`)
             .then(res => res.json());
         confEndpointsRaw.set(conformanceEndpoints);
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

<svelte:head>
    <title>APISnoop | {$activeRelease.release}</title>
</svelte:head>
{#if $activeRelease && $activeRelease.endpoints.length > 0}
    <Sunburst />
    <NewEndpoints />
{:else}
    <em>loading data...</em>
{/if}
