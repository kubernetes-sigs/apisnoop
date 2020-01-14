<script>
 import { currentDepth, breadcrumb } from '../stores';
 $: [level , category , endpoint] = $breadcrumb;
</script>

<p>{level} {category} {endpoint}</p>
