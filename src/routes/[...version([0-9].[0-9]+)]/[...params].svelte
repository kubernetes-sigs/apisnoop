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
 import {
   compact,
   isEqual,
   join
 } from 'lodash-es';
 import { goto } from '@sapper/app';

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

 const updatePath = async (event) => {
   console.log({params: event.detail.params});
   let {version, level, category, endpoint} = event.detail.params;
   activeFilters.update(af => ({...af, ...event.detail.params}));
   let filterSegments = compact([version, level, category, endpoint]);
   let urlPath = join([...filterSegments], '/');
   let x = window.pageXOffset;
   let y = window.pageYOffset;
   goto(urlPath).then(() => window.scrollTo(x,y));
 }
</script>
<svelte:head>
  <title>APISnoop | {$release.release}</title>
</svelte:head>

<Sunburst on:newPathRequest={updatePath}/>
