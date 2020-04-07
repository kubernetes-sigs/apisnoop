<script>
 import dayjs from 'dayjs';
 import { goto } from '@sapper/app';
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease } from '../../stores/coverage-over-time.js';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'

 $: ({
   bucket,
   job,
   release,
   date,
   test_hits_increase,
   conf_hits_increase,
   total_endpoints
 } = $activeRelease);

 $: link = `${SPYGLASS_URL}/${bucket}/${job}`

  </script>
  {#if release}
  <SectionHeader title='{release} In Depth'>
    <em>Data from <a href="{link}" title="spyglass link" target="_blank_" rel="noreferrer noopener">an e2e test suite run</a>, from {date}</em>
  </SectionHeader>
  {/if}

<style>
</style>
