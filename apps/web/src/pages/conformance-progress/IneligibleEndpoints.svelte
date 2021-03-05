<script>
 import {
   ineligibleEndpointsRaw,
   ineligibleEndpoints
 } from '../../store/conformance.js';
 import { onMount } from 'svelte';
 import { RELEASES_URL } from '../../lib/constants.js';

 const endpointsURL = `${RELEASES_URL}/ineligible_endpoints.json`;
 onMount(async() => {
   const endpoints = await fetch(endpointsURL).then(res => res.json())
   ineligibleEndpointsRaw.set(endpoints);
 })
</script>
<h2>Ineligible Endpoints</h2>
<em>total endpoints: {$ineligibleEndpoints.length}</em>
<ul>
{#each $ineligibleEndpoints as { endpoint, reason, link}}
    <li>{endpoint} <i><a href={link} target="_blank" rel='nofollow noreferrer'>{reason}</a></i></li>
{/each}
</ul>
