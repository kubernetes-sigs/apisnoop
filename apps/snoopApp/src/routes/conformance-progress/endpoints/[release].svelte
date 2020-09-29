<script context="module">
 import {
   camelCase,
   isEmpty,
   flatten,
   mapValues
 } from 'lodash-es';

 export function preload({ params, query }) {
   const queryFilters = flatten([query.filter]);

   const {release} = params;
   let payload = {
     release,
     queryFilters: queryFilters.filter(f => f !== undefined)
   }
   return {payload};
 }
</script>
<script>
  import { onMount, afterUpdate } from 'svelte';
 import {
   confEndpointsRaw,
   confFilters,
   confFilteredEndpoints
 } from '../../../store/conformance.js';
 import ConformanceEndpointsTable from '../../../components/conformance-endpoints-table.svelte';
 import ConformanceEndpointsFilters from '../../../components/conformance-endpoints-filter.svelte';

 export let payload;
 const endpointsURL = 'https://raw.githubusercontent.com/apisnoop/snoopDB/master/resources/coverage/conformance-endpoints.json'

 let { release, queryFilters } = payload;

 let updateConfFilters = (qf) => {
   if (!isEmpty(qf)) {
     qf = qf.map(f => camelCase(f));
     confFilters.update(cf => {
       const newFilters = mapValues(cf, (v,k) => {
         if (k === 'release') {
           return v;
         } else {
           return qf.includes(k);
         }
       })
       return newFilters;
       })
   }
 }

 onMount(async() => {
   const endpoints = await fetch(endpointsURL).then(res => res.json())
   confEndpointsRaw.set(endpoints);
   updateConfFilters(queryFilters);
 })
 afterUpdate(() => {
   if (release && $confFilters.release !== release) {
     confFilters.update(f => ({...f, release}));
     updateConfFilters(queryFilters);
   }
  })

</script>
<a href="conformance-progress">← Back to Conformance Progress</a>
<h2>Conformance Endpoints for {release} </h2>
<ConformanceEndpointsFilters />
<em>Total Endpoints: {$confFilteredEndpoints.length}</em>
<ConformanceEndpointsTable endpoints="{$confFilteredEndpoints}" />
