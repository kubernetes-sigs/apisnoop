<script>
 import dayjs from 'dayjs';
 import { goto } from '@sapper/app';
 import SectionHeader from '../SectionHeader.svelte';
 import { release } from '../../store';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'

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
    <em>Data from <a href="{link}" title="spyglass link" target="_blank_" rel="noreferrer noopener">an e2e test suite run</a>, from {date}</em>
  </SectionHeader>
{/if}
