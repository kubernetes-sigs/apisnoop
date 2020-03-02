<script context="module">
 export function preload ({ params, query }) {
     return this
         .fetch(`coverage/index.json`)
         .then(r => r.json())
         .then(payload => ({ payload }));
 };
</script>

<script>
 import { goto } from '@sapper/app';
 import dayjs from 'dayjs'
 import { rawBucketsAndJobs, bucketsAndJobs } from '../../stores';

 export let payload;

 let {
     rawBucketsAndJobsPayload
     } = payload;

 rawBucketsAndJobs.set(rawBucketsAndJobsPayload)
 $: selectedBucket = '';
 $: selectedJob = '';
 $: jobs = selectedBucket !== ''
         ? $bucketsAndJobs[selectedBucket]['jobs']
         : {};

 let jobDate = job => dayjs(job).format('DD MMMM, YYYY');
 let jobClick = job =>  {
     selectedJob = job;
     goto(`coverage/${selectedBucket}/${selectedJob.job}`)
 }
</script>


{#if selectedBucket === ''}
<h1>Select A Bucket:</h1>
<ul>
{#each Object.keys($bucketsAndJobs) as bucket}
    <li on:click={() => selectedBucket = bucket}>{bucket}</li>
{/each}
</ul>
{:else}
    {#if selectedJob === ''}
        <h1>Select a Job:</h1>
        <p class='bucket'>for {selectedBucket}</p>
        <ul>
        {#each jobs as job}
            <li on:click={() => jobClick(job)}>{jobDate(job.timestamp)}</li>
        {/each}
        </ul>
    {:else}
        <div id='loading'>
        <p>loading {selectedBucket} on {jobDate(selectedJob.timestamp)}...</p>
        </div>
    {/if}
{/if}


<style>
 ul {
     max-width: 800px;
     margin: auto;
     list-style-type: none;
     font-size: 3vw;
     display: flex;
     justify-content: center;
     align-items: center;
     flex-flow: column;
     cursor: pointer;
 }

 li {
     font-weight: 500;
 }

 h1 {
     margin-bottom: 0;
 }

 p.bucket {
     margin-top: 0;
     font-size: 1.4em;
     font-style: italic;
 }

 div#loading {
     max-width: 800px;
     height: 100%;
     margin: auto;
     display: flex;
     justify-content: center;
     align-items: center;
     flex-flow: column;
 }

 div#loading p {
     font-size: 2em;
     font-weight: 200;
     font-style: italic;
 }

</style>
