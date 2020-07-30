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

 export let payload;
 const endpointsURL = 'https://raw.githubusercontent.com/apisnoop/snoopDB/master/resources/coverage/conformance-endpoints.json'

 let { release } = payload;
 $: filters = Object.keys($confFilters).filter(key => key !== 'release');

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
<table>
  <thead>
    <tr>
      <th>Endpoint</th>
      <th>Promotion Release</th>
      <th>Tested Release</th>
    </tr>
  </thead>
  <tbody>
    {#each $confFilteredEndpoints as {endpoint, colour, promotion_release, tested_release}}
      <tr>
        <td style="border-left: 2px solid {colour};">{endpoint}</td>
        <td class="release">{promotion_release}</td>
        <td class="release">
          {#if tested_release}
            {tested_release}
            {:else}
            not tested
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<style>
 thead th {
   padding: 0.25rem;
   border-right: 1px solid gray;
   border-bottom: 1px solid gray;
 }
 tr {
   margin: 0;
 }
 td {
   padding: 0.25rem;
   margin-bottom: none;
   margin-right: 0.5rem;
 }
 td.release {
   text-align: right;
 }
</style>
