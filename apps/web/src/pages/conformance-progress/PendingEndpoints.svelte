<script>
 import yaml from 'js-yaml';
 import {
  pendingEndpoints
 } from '../../store/conformance.js';
 import { onMount } from 'svelte';
 import { PENDING_ENDPOINTS_URL } from '../../lib/constants.js';

 onMount(async() => {
   const endpoints = await fetch(PENDING_ENDPOINTS_URL)
   .then(res=>res.text())
   .then(text => yaml.load(text));
   pendingEndpoints.set(endpoints);
 });

</script>

<h2>Pending Endpoints</h2>
<em>total endpoints: {$pendingEndpoints.length}</em>
<ul>
{#each $pendingEndpoints as endpoint}
    <li>{endpoint}</li>
{/each}
</ul>
