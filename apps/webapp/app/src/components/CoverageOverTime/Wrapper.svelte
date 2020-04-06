<script>
 import Prologue from './Prologue.svelte';
 import Graph from './Graph.svelte';
</script>

 <section id='coverage-over-time'>
   <Prologue />
   <Graph on:dataClick />
 </section>


<style>
 section {
   margin-top: var(--section-spacing);
   margin-bottom: var(--section-spacing);
   padding: 1rem;
 }
</style>
