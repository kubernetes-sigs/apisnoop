<script>
 import yaml from 'js-yaml';
 import {
   ineligibleEndpoints
 } from '../../store/conformance.js';
 import { onMount } from 'svelte';
 import { RELEASES_URL, INELIGIBLE_ENDPOINTS_URL } from '../../lib/constants.js';

 const endpointsURL = `${RELEASES_URL}/ineligible_endpoints.json`;
 onMount(async() => {
   const endpoints = await fetch(INELIGIBLE_ENDPOINTS_URL)
     .then(res=>res.text())
     .then(text => yaml.load(text));
   ineligibleEndpoints.set(endpoints);
 })
</script>
<h2>Ineligible Endpoints</h2>
<em>total endpoints: {$ineligibleEndpoints.length}</em>
<ul>
{#each $ineligibleEndpoints as { endpoint, reason, link}}
    <li>{endpoint} <i><a href={link} target="_blank" rel='nofollow noreferrer'>{reason}</a></i></li>
{/each}
</ul>
