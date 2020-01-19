<script>
 import Sunburst from './Sunburst.svelte';
 import CoverageHeader from './CoverageHeader.svelte';
 import CoverageStats from './CoverageStats.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
 import TestsList from './TestsList.svelte';
</script>

<section id='coverage'>
    <CoverageHeader />
    <Breadcrumb />
    <Sunburst />
    <CoverageStats />
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

