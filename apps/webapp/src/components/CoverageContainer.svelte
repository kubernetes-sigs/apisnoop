<script>
 import Sunburst from './Sunburst.svelte';
 import CoverageHeader from './CoverageHeader.svelte';
 import CoverageStats from './CoverageStats.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
</script>

<section id='coverage'>
    <CoverageHeader />
    <Breadcrumb />
    <Sunburst />
    <CoverageStats />
</section>


<style>
 section {
     display: grid;
     grid-template-columns: 700px 1fr;
 }
</style>

