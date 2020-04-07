<script>
 import {
   activeFilters,
   testTagsForEndpoint
 } from '../../stores';
 import { goto, stores } from '@sapper/app';
 import { updateQueryParams } from '../../lib/helpers.js';

 const { page} = stores();

 function handleClick (tag) {
   let queryParams = updateQueryParams($page, {test_tags: [tag]});
   let url = `${$page.path}${queryParams}#tests`;

   activeFilters.update(af => ({...af, test_tags: [tag]}))
   document.getElementById('tests').scrollIntoView();

   goto(url)
     .then(() => {
       document.getElementById('tests').scrollIntoView();
     });
 };
</script>


{#if $testTagsForEndpoint.length > 0}
<div id='test-tags'>
  <ul>
    {#each $testTagsForEndpoint as testTag}
    <li role='button' on:click={() => handleClick(testTag)}>{testTag}</li>
    {/each}
  </ul>
</div>
{/if}


<style>
 li {
   cursor: pointer;
 }
</style>
