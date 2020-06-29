<script context="module">
 export function preload({ params, query }) {
   const [version] = params.version;
   let path = [version, ...params.params].join('/')
   console.log({path})
   return this.fetch(`${path}.json`)
                         .then(r => r.json())
                         .then(payload => ({ payload }));
 }
</script>
<script>
 import {
   activeFilters,
   release
 } from '../../store';
 import { isEqual } from 'lodash-es';
 import Sunburst from '../../components/sunburst/Wrapper.svelte'
 export let payload;

 const {
   releaseData,
   level,
   category,
   endpoint
 } = payload;

 release.update(rel => isEqual(rel, releaseData)
                               ? rel
                               : releaseData);
 activeFilters.update(af => ({
   ...af,
   level: level || '',
   category: category || '',
   endpoint: endpoint || ''
 }))
</script>

<svelte:head>
  <title>APISnoop | {$release.release}</title>
</svelte:head>

<Sunburst />
