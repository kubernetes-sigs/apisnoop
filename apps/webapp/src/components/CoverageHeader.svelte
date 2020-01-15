<script>
 import dayjs from 'dayjs';
 import { bucketAndJobMetadata as metadata} from '../stores';
 import { onMount, afterUpdate } from 'svelte';

 $: bucket = $metadata.bucket;
 $: job = $metadata.job;
 $: timestamp = dayjs($metadata.timestamp).format('DD MMMM, YYYY');
</script>

<header>
    <h1>{bucket}</h1>
    <p>{timestamp}</p>
</header>

<style>
 header {
     margin-bottom: 1.5em;
     grid-column: 1/3;
 }

 h1 {
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

