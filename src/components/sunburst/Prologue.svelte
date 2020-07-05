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
  <SectionHeader title='{release} Testing Coverage'>
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
    <p>This sunburst shows the testing coverage for the Kubernetes API, based on auditlog data pulled from e2e test runs.  The endpoints are organized by level (alpha, beta, or stable), then category.  The color of an endpoint indicates its level of coverage.  Gray means no test coverage, faded coloring means its tested but not conformance tested, solid coloring means its tested and conformance tested.
    <p> You can click on any section of the sunburst to zoom into that region. Click into the center to zoom out one level</p>
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
