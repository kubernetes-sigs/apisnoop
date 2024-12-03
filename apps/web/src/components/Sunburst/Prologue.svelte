<script>
 import dayjs from 'dayjs';
 import { takeRight } from 'lodash-es';
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease, releases, versions } from '../../store';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-ci-logs/logs'
 let releaseSwitch = false;

 $: ({
   release,
   release_date,
   sources
 } = $activeRelease);

 $: date = dayjs(release_date).format('DD MMMM, YYYY');

 const prettyPrintNumber = (num) => {
   let numbers = ['zero', 'one', 'two', 'three', 'four', 'five'];
   return numbers[Number(num)];
 }

</script>

{#if release}
  <SectionHeader title={""}>
    <h2>{release} Testing Coverage
      <button on:click={() => releaseSwitch = true}>switch release</button>
    </h2>
    {#if releaseSwitch}
      <ul class='releases'>
      {#each $versions as version}
        <li><a href={'/'+version+'/'} on:click={() => releaseSwitch = false}>{version}</a></li>
      {/each}
      </ul>
    {:else}
      <em>Data comes from {prettyPrintNumber(sources.length)} e2e test suite {#if sources.length > 1}runs{:else}run{/if} from {date}:</em>
        <ul class='sources'>
          {#each sources as source}
            <li>
            <a href="{source}" title="spyglass link" target="_blank" rel="noreferrer noopener">
              {takeRight(source.split('/'), 2).join('/')}
            </a>
            </li>
          {/each}
        </ul>
    {/if}
    <p>This sunburst shows the testing coverage for the Kubernetes API, based on
    auditlog data pulled from e2e test runs. The endpoints are organized by
    level (alpha, beta, or stable), then category. The color of an endpoint
    indicates its level of coverage. Gray means no test coverage, faded coloring
    means its tested but not conformance tested, solid coloring means its tested
    and conformance tested.
    <p> You can click on any section of the sunburst to zoom into that region.
    Click into the center to zoom out one level</p>
  </SectionHeader>
{/if}


<style>
 ul.releases , ul.releases li {
   display: inline;
   margin-right: 1rem;
   padding-left: 0;
   margin-left: 0;
 }
 a:hover {
   background: aliceblue;
 }
 ul.sources {
   margin: 0;
   padding: 0;
   list-style-type: none;
 }
</style>
