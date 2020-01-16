<script>
 import { testsAndTagsForEndpoint } from '../stores';
 import { uniq } from 'lodash-es';
 import { afterUpdate } from 'svelte'
 $: testTags = uniq($testsAndTagsForEndpoint[0].tests.map(tt => tt.test_tag));
 $: tests = uniq($testsAndTagsForEndpoint[0].tests.map(tt => tt.test));

 afterUpdate(()=>console.log({tt: $testsAndTagsForEndpoint, testTags}));
</script>


{#if testTags.length > 0}
    <div id='test-tags'>
        <ul>
            {#each testTags as testTag}
                <li>{testTag}</li>
            {/each}
        </ul>
    </div>
    <div id='tests'>
        <ul>
            {#each tests as test}
                <li>{test}</li>
            {/each}
        </ul>
    </div>
{/if}


