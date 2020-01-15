<script>
 import { breadcrumb, coverageAtDepth } from '../stores';
 import { isEmpty } from 'lodash-es';
 let percentage = (sum, total) => ((sum / total) * 100).toFixed(2);
 $: total = $coverageAtDepth.totalEndpoints;
 $: tested = $coverageAtDepth.testedEndpoints;
 $: confTested = $coverageAtDepth.confTestedEndpoints;
 $: percentTested = `${percentage(tested,total)}%`;
 $: percentConfTested = `${percentage(confTested, total)}%`;
 $: [level, category ] = $breadcrumb;
</script>

{#if !isEmpty($coverageAtDepth)}
<div id='coverage-stats'>
    <p>{level} {category}</p>
    <h2> Coverage</h2>
    <ul>
        <li><strong>{total}</strong> total endpoints</li>
        <li> <strong>{percentTested}</strong> tested ({tested} endpoints)</li>
        <li><strong>{percentConfTested}</strong> conformance tested ({confTested} endpoints)</li>
    </ul>
</div>
{/if}


<style>
 div {
     grid-column: 2;
     padding-left: 1em;
     padding-right: 1em;
 }

 h2 {
     margin-bottom: 0;
 }

 p {
     margin-top: 0;
     margin-bottom: 0;
     padding: 0;
     font-weight: 200;
     font-size: 1.3em;
     font-variant-caps: small-caps;
 }


 ul {
     padding-left: 0;
     list-style-type: none;
 }

 strong {
     font-family: monospace;
 }

</style>


