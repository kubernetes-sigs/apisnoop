<script>
 import {
   confEndpointsRaw,
   confEndpoints
 } from '../../../store/conformance.js';
 import { onMount } from 'svelte';

 const endpointsURL = 'https://raw.githubusercontent.com/apisnoop/snoopDB/master/resources/coverage/conformance-endpoints.json'
 onMount(async() => {
   const endpoints = await fetch(endpointsURL).then(res => res.json())
   console.log({endpoints});
   confEndpointsRaw.set(endpoints);
 })
</script>
<h2>Endpoints</h2>
<ul>
{#each $confEndpoints as { endpoint, promotion_release, tested_release}}
  <li>{endpoint}<b>{promotion_release}</b></li>
{/each}
</ul>

