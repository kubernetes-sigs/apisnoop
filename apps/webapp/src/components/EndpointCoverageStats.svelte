<script>
 import { endpointCoverage } from '../stores';
 import Icon from 'fa-svelte';
 import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';

 let checkmark = faCheckCircle;

 $: ({
     operation_id,
     tested,
     confTested,
     description,
     path,
     group,
     version,
     kind
     } = $endpointCoverage);
</script>


<div id='coverage-stats'>
    <p class='path'>{path}</p>
    <h2>{operation_id}</h2>

    <dl id='endpoint-details'>
        <dt>description</dt><dd>{description}</dd>
        {#if group}<dt>group</dt><dd>{group}</dd>{/if}
        {#if version}<dt>version</dt><dd>{version}</dd>{/if}
        {#if kind}<dt>kind</dt><dd>{kind}</dd>{/if}
    </dl>

    {#if tested}
        <p class='stat'> <span><Icon class='success check' icon={checkmark} /></span> Tested!</p>
    {:else}
        <p class='stat'> <span><Icon class='check fail' icon={checkmark} /></span> Untested</p>
    {/if}

    {#if confTested}
        <p class='stat'> <span><Icon class='check success' icon={checkmark} /></span> Conformance Tested</p>
    {:else}
        <p class='stat'> <span><Icon class='check fail' icon={checkmark} /></span> No Conformance Tests</p>
    {/if}

</div>

<style>
 div#coverage-stats {
     grid-column: 2;
     padding-left: 1em;
     padding-right: 1em;
 }

 h2 {
     margin-bottom: 1em;
 }

 p.path {
     margin-top: 0;
     margin-bottom: 0;
     padding: 0;
     font-weight: 200;
     font-size: 1.3em;
     font-variant-caps: small-caps;
 }

 p.stat {
     display: flex;
     align-items: center;
     font-size: 1.3em;
     margin: 0;
     font-style: italic;
     font-weight: 200;
 }

 div :global(.check) {
     font-size: 1.3em;
     padding-right: 0.25em;
     margin-top: 0.1em;
 }
 div :global(.success) {
     color: rgba(60, 180, 75, 1);
 }

 div :global(.fail) {
     color: rgba(233, 233, 233, 1);
 }

 ul {
     padding-left: 0;
     list-style-type: none;
 }

 strong {
     font-family: monospace;
 }

 dl {
     display: grid;
     font-size: 0.85em;
     grid-template-columns: 5rem 1fr;
     width: 90%;
 }

 dt {
     border: 1px solid black;
     border-top: none;
     border-right: none;
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 0;
     margin: 0;
     background: #CCCCCC;
 }

 dd {
     border: 1px solid black;
     border-top: none;
     display: inloine;
     padding: 0;
     padding-left: 1em;
     margin: 0;
     font-family: monospace;
 }

 dt:first-of-type , dd:first-of-type {
     border-top: 1px solid black;
 }






</style>

