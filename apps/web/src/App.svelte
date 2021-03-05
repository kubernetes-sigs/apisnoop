<script>
 import router from "page";
 import Home from './pages/Home.svelte';
 import About from './pages/About.svelte';
 import ConformanceProgress from './pages/conformance-progress/Index.svelte';
 import ConformanceEndpoints from './pages/conformance-progress/Endpoints.svelte';
 import IneligibleEndpoints from './pages/conformance-progress/IneligibleEndpoints.svelte';
 import Nav from './components/Nav.svelte';
 import { flatten } from 'lodash-es';

 let page;
 let params;
 let query;

 function queryObj (qs) {
   // convert query string to object.
   // does not account for arrays at the moment.
   if (qs === "") {
     return { };
   } else {
     const parts = qs.split('&');
     return parts.reduce((acc, cur) => {
       const [k, v] = cur.split("=");
       if (acc[k] != null) {
         acc[k] = flatten([acc[k], v]);
       } else {
         acc[k] = v;
       }
       return acc;
     }, { });
   }
 }

 router("/about", ()=> page = About);
 router("/conformance-progress", (ctx, next) => {
   params = ctx.params;
   query = {...queryObj(ctx.querystring)};
   next()}, () => page = ConformanceProgress);
 router("/conformance-progress/endpoints/:release?/:filter?", (ctx, next) => {
   params = ctx.params;
   query = {...queryObj(ctx.querystring)};
   next()}, () => page = ConformanceEndpoints);
 router("/conformance-progress/ineligible-endpoints", () => page = IneligibleEndpoints);

 router('/:version?/:level?/:category?/:endpoint?', (ctx, next) => {
   params = ctx.params;
   next()},  () => page = Home);

 router.start();
</script>

<svelte:head>
	<title>APISnoop</title>
</svelte:head>
<Nav segment={page.name}/>
<main>
  <svelte:component this={page} {params} {query}/>
</main>

<style>

 main {
   position: relative;
   font-size: 16px;
   background-color: white;
   padding: 2em;
   box-sizing: border-box;
   max-width: 1100px;
 }

</style>
