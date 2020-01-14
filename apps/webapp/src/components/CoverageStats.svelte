<script>
 import { coverageAtDepth } from '../stores';
 import { isEmpty } from 'lodash-es';
 $: total = $coverageAtDepth.totalEndpoints;
 $: tested = $coverageAtDepth.testedEndpoints;
 $: confTested = $coverageAtDepth.confTestedEndpoints;
</script>

{#if !isEmpty($coverageAtDepth)}
<h2> Coverage</h2>
<ul>
    <li>{total} total endpoints</li>
    <li>{tested} tested</li>
    <li>{confTested} conformance tested</li>
</ul>
{/if}


