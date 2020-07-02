<script>
 import dayjs from 'dayjs';
 import { goto } from '@sapper/app';
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease } from '../../store';
 import { RELEASES } from '../../lib/constants.js';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'
 let releaseSwitch = false;

 $: ({
   release,
   release_date,
   source
 } = $activeRelease);

 $: date = dayjs(release_date).format('DD MMMM, YYYY');

</script>

{#if release}
  <SectionHeader title='{release} In Depth'>
    {#if releaseSwitch}
      <ul class='releases'>
      {#each RELEASES as rel}
        <li><a href={rel} on:click={() => releaseSwitch = false}>{rel}</a></li>
      {/each}
      </ul>
    {:else}
    <em>Data from <a href="{source}" title="spyglass link" target="_blank_" rel="noreferrer noopener">an e2e test suite run</a>, from {date}</em>
    {/if}
    <button on:click={() => releaseSwitch = true}>switch release</button>
  </SectionHeader>
{/if}


<style>
 ul , li {
   display: inline;
   margin-right: 1rem;
   padding-left: 0;
   margin-left: 0;
 }
 a:hover {
   background: aliceblue;
 }
</style>
