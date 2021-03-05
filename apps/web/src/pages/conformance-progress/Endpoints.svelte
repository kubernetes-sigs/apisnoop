<script>
  import { onMount, afterUpdate } from 'svelte';
 import {
   camelCase,
   isEmpty,
   flatten,
   mapValues
 } from 'lodash-es';
 import {
   confEndpointsRaw,
   confFilters,
   confFilteredEndpoints
 } from '../../store/conformance.js';
 import {
   latestVersion
 } from '../../store';
 import{ RELEASES_URL } from '../../lib/constants.js';

 import ConformanceEndpointsTable from '../../components/conformance-endpoints-table.svelte';
 import ConformanceEndpointsFilters from '../../components/conformance-endpoints-filter.svelte';

 const endpointsURL = `${RELEASES_URL}/conformance-endpoints.json`;

 export let params;
 export let query;

 $: release = params.release ? params.release : $latestVersion;
 $: queryFilters = query.filter ? flatten([query.filter]) : [];

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
<a href="/conformance-progress">← Back to Conformance Progress</a>
<h2>Conformance Endpoints for {release} </h2>
<ConformanceEndpointsFilters />
<em>Total Endpoints: {$confFilteredEndpoints.length}</em>
<ConformanceEndpointsTable endpoints="{$confFilteredEndpoints}" />
