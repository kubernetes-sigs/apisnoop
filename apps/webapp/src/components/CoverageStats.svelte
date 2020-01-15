<script>
 import { coverageAtDepth } from '../stores';
 import { isEmpty } from 'lodash-es';
 let percentage = (sum, total) => ((sum / total) * 100).toFixed(2);
 $: total = $coverageAtDepth.totalEndpoints;
 $: tested = $coverageAtDepth.testedEndpoints;
 $: confTested = $coverageAtDepth.confTestedEndpoints;
 $: percentTested = `${percentage(tested,total)}%`;
 $: percentConfTested = `${percentage(confTested, total)}%`;
</script>

{#if !isEmpty($coverageAtDepth)}
<div id='coverage-stats'>
    <h2> Coverage</h2>
    <ul>
        <li>{total} total endpoints</li>
        <li> {percentTested} tested ({tested} endpoints)</li>
        <li>{percentConfTested} conformance tested ({confTested} endpoints)</li>
    </ul>
</div>
{/if}


<style>
 div {
     grid-column: 2;
 }
</style>


