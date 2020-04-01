<script context="module">
 import { join } from 'lodash-es';
 export function preload ({ params, query }) {
   let path = join(params.coverage, '/');
   return this
     .fetch(`/${path}.json`)
     .then(r => r.json())
     .then(payload => ({ payload }));
 };
</script>

<script>
 import { onMount, afterUpdate } from 'svelte';
 export let payload;
</script>

<h1>Web Page is Getting There</h1>
