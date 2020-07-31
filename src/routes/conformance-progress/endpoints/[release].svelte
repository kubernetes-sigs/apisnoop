<script context="module">
 export function preload({ params, query }) {
   console.log({query})
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
   confFilteredEndpoints
 } from '../../../store/conformance.js';
 import ConformanceEndpointsTable from '../../../components/conformance-endpoints-table.svelte';

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
<h2>Conformance Endpoints for {release} </h2>
<p>{$confFilteredEndpoints.length}</p>
<ConformanceEndpointsTable endpoints="{$confFilteredEndpoints}" />
