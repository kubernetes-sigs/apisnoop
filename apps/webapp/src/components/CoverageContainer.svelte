<script>
 import dayjs from 'dayjs';
 import Sunburst from './Sunburst.svelte';
 import CoverageStats from './CoverageStats.svelte';
 import Breadcrumb from './Breadcrumb.svelte';
 import {
     activeBucketAndJob
     } from '../stores';

 $: bucket = $activeBucketAndJob.bucket;
 $: job = $activeBucketAndJob.job;
 $: date = dayjs($activeBucketAndJob.timestamp).format('DD MMMM, YYYY');
</script>

<main>
    <h2>{bucket}</h2>
    <p>Job {job}, run {date}</p>
    <Breadcrumb />
    <Sunburst />
    <CoverageStats />
</main>

