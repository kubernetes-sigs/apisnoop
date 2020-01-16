<script>
 import {
     testsForEndpoint,
     testTagsForEndpoint
 } from '../stores';
 import { uniq } from 'lodash-es';
 import { afterUpdate } from 'svelte'


 afterUpdate(()=>console.log({tt: $testsForEndpoint}));
</script>


{#if $testTagsForEndpoint.length > 0}
    <div id='test-tags'>
        <ul>
            {#each $testTagsForEndpoint as testTag}
                <li>{testTag}</li>
            {/each}
        </ul>
    </div>
    <div id='tests'>
        <ul>
            {#each $testsForEndpoint as test}
                <li>{test}</li>
            {/each}
        </ul>
    </div>
{/if}


