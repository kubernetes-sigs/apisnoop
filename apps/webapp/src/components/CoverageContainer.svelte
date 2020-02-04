<script>
 import Sunburst from './Sunburst.svelte';
 import Sunburst2 from './Sunburst2.svelte';
 import CoverageHeader from './CoverageHeader.svelte';
 import CoverageStats from './CoverageStats.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
 import TestsList from './TestsList.svelte';
 import Filters from './Filters.svelte';
</script>

<section id='coverage'>
    <CoverageHeader />
    <!-- <Filters /> -->
    <Breadcrumb />
    <Sunburst />
    <CoverageStats />
    <Sunburst2 />
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

