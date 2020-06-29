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
   release,
   activeFilters
 } from '../../store';
 import {
   compact,
   join
 } from 'lodash-es';
 import { goto } from '@sapper/app';

 import Sunburst from '../../components/sunburst/Wrapper.svelte'

 export let releaseData;

 release.set(releaseData);

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
  <title>APISnoop for {$release.release}</title>
</svelte:head>

<Sunburst on:newPathRequest={updatePath} />
