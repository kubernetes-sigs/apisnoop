<script context="module">
 export async function preload({ params, query }) {
   const res = await this.fetch(`index.json`);
   const data = await res.json();

   if (res.status === 200) {
     return {releaseData: data};
   } else {
     this.error(res.status, data.message);
   }
 }
</script>
<script>
 import { onMount, afterUpdate } from 'svelte';
 import {
   endpoints,
   release,
   sunburst
 } from '../store';

 import Sunburst from '../components/sunburst/Wrapper.svelte'

 export let releaseData;

 release.set(releaseData);

 afterUpdate(()=>console.log({release: $release,
                             ep: $endpoints[0],
                             sunburst: $sunburst
                             }));



</script>
<svelte:head>
  <title>APISnoop</title>
</svelte:head>

<Sunburst />
<style>
 h1 {
   text-align: center;
   margin: 0 auto;
   font-size: 2.8em;
   text-transform: uppercase;
   font-weight: 700;
   margin: 0 0 0.5em 0;
 }

 @media (min-width: 480px) {
   h1 {
     font-size: 4em;
   }
 }
</style>

