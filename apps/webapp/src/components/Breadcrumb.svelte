<script>
 import { breadcrumb } from '../stores';

 $: level = $breadcrumb[0] || '';
 $: category = $breadcrumb[1] || '';
 $: endpoint = $breadcrumb[2] || '';

</script>

<p>{level} {category} {endpoint}</p>
