<script context="module">
 export async function preload({params, query}) {
   let [version] = params.version;
   const res = await this.fetch(`${version}.json`);
   const data = await res.json();

   if (res.status === 200) {
     return ({releaseData: data})
   } else {
     this.error(res.status, data.message)
   }
 }
</script>
<script>
 import {
   release
 } from '../../store';

 import Sunburst from '../../components/sunburst/Wrapper.svelte'

 export let releaseData;

 release.set(releaseData);
</script>

<svelte:head>
  <title>APISnoop for {$release.release}</title>
</svelte:head>

<Sunburst />
