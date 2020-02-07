<script>
 import { bucketsAndJobs } from '../../stores';
 import dayjs from 'dayjs';
 import { afterUpdate } from 'svelte';

 $: buckets = Object.keys($bucketsAndJobs);
 $: selectedBucket = '';
 $: jobs = (selectedBucket !== '')
         ? $bucketsAndJobs[selectedBucket]['jobs']
         : '';

 let prettyDate = (timestamp) => dayjs(timestamp).format('DD MMMM, YYYY');
 let switchTo = (bucket, job) => {
   history.pushState({},'', `/coverage/${bucket}/${job}`);
   window.location.reload();
 };
</script>

{#if selectedBucket === ''}
<h1>Select your bucket</h1>
<ul>
  {#each buckets as bucket}
  <li on:click={() => selectedBucket = bucket}>{bucket}</li>
  {/each}
</ul>
{:else}
<h1>{selectedBucket}</h1>
<h2>Select a date</h2>
<ul>
  {#each jobs as job}
  <li on:click={() => switchTo(selectedBucket, job.job)}>
      {prettyDate(job.timestamp)}
  </li>
  {/each}
</ul>
{/if}




