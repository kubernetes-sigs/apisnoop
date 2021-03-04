<script>
 import Prologue from './Prologue.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
 import Graph from './Graph.svelte';
 import Stats from './Stats.svelte';
</script>

<section id='sunburst'>
  <Prologue />
  <Breadcrumb />
  <Graph />
  <Stats />
</section>

<style>
 section {
   display: grid;
   grid-template-columns: 700px 1fr;
 }
 @media (max-width: 667px) {
   section {
     display: flex;
     flex-flow: column;
   }
 }
</style>
