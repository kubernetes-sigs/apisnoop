<script>
 import router from "page";
 import Home from './pages/Home.svelte';
 import About from './pages/About.svelte';
 export let name;
 let page;

 router("/", ()=> page = Home);
 router("/about", ()=> page = About);
 router.start();
</script>

<main>
  <h1>Hello {name}!</h1>
  <svelte:component this={page} />
</main>

<style>
 main {
   text-align: center;
   padding: 1em;
   max-width: 240px;
   margin: 0 auto;
 }

 h1 {
   color: #ff3e00;
   text-transform: uppercase;
   font-size: 4em;
   font-weight: 100;
 }

 @media (min-width: 640px) {
   main {
	 max-width: none;
   }
 }
</style>
