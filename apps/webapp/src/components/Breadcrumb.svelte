<script>
 import { currentDepth, breadcrumb } from '../stores';
 $: [level , category , endpoint] = $breadcrumb;
</script>

<div id='breadcrumb'>
<p>{level} {category} {endpoint}</p>
</div>

<style>
 div{
     height: 3em;
     grid-column: 1/3;
     margin-bottom: 1.5em;
 }
</style>

