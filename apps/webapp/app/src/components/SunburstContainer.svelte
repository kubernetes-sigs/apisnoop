<script>
 import Sunburst from './Sunburst.svelte';
 import SunburstHeader from './SunburstHeader.svelte';
 import SunburstStats from './SunburstStats.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
 import TestsList from './TestsList.svelte';
</script>

<section id='coverage'>
  <SunburstHeader />
  <Breadcrumb />
  <Sunburst />
  <SunburstStats />
  <TestsList />
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
