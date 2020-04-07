<script>
 import dayjs from 'dayjs';
 import { goto } from '@sapper/app';
 import { activeBucketAndJob } from '../../stores';

 $: bucket = $activeBucketAndJob.bucket;
 $: job = $activeBucketAndJob.job;
 $: timestamp = dayjs($activeBucketAndJob.timestamp)
   .format('DD MMMM, YYYY');
</script>

<header>
  <h2>{bucket}</h2>
  <p>{timestamp}</p>
</header>

<style>
 header {
   margin-bottom: 1.5em;
   grid-column: 1;
 }

 h2 {
   padding: 0;
   font-variant-caps: small-caps;
   margin-bottom: 0;
 }

 p {
   margin-top: 0;
   font-variant-caps: small-caps;
   padding-left: 0.25em;
 }
</style>
