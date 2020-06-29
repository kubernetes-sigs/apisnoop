<script>
 import dayjs from 'dayjs';
 import { goto } from '@sapper/app';
 import SectionHeader from '../SectionHeader.svelte';
 import { release } from '../../store';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'
 let releaseSwitch = false;

 $: ({
   release: version,
   release_date
 } = $release);

 // $: link = `${SPYGLASS_URL}/${bucket}/${job}`
 $: link = 'https://google.com';
 $: date = dayjs(release_date).format('DD MMMM, YYYY');

</script>

{#if release}
  <SectionHeader title='{version} In Depth'>
    {#if releaseSwitch}
      <ul class='releases'>
        <li on:click={() => goto('1.19').then(l => location.reload())}>1.19</li>
        <li on:click={() => goto('1.18').then(l => location.reload())}>1.18</li>
        <li on:click={() => goto('1.17').then(l => location.reload())}>1.17</li>
        <li on:click={() => goto('1.16').then(l => location.reload())}>1.16</li>
        <li on:click={() => goto('1.15').then(l => location.reload())}>1.15</li>
        </ul>
        {:else}
    <em>Data from <a href="{link}" title="spyglass link" target="_blank_" rel="noreferrer noopener">an e2e test suite run</a>, from {date}</em>
    {/if}
    <button on:click={() => releaseSwitch = true}>switch release</button>
  </SectionHeader>
{/if}


<style>
 ul.releases li {
   display: inline;
   margin-right: 1rem;
   }
</style>
