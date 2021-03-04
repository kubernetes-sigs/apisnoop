<script>
 import router from "page";
 import Home from './pages/Home.svelte';
 import About from './pages/About.svelte';
 import Nav from './components/Nav.svelte';

 let page;
 let params;

 router("/about", ()=> page = About);
 router('/:version?/:level?/:category?/:endpoint?', (ctx, next) => {
   console.log({ctx})
   params = ctx.params;
   next()},  () => page = Home);

 router.start();
</script>

<Nav segment={page.name}/>
<main>
  <svelte:component this={page} {params} />
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

 @media (min-width: 640px) {
   main {
     max-width: none;
   }
 }
</style>
