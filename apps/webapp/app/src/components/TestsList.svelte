<script>
 import { 
   activeFilters,
   breadcrumb,
   testsForEndpoint,
   testTagsForEndpoint,
   filteredTests
 } from '../stores';
 import { goto, stores } from '@sapper/app';
 import { updateQueryParams } from '../lib/helpers.js';
 import { isEmpty} from 'lodash-es';

 const { page } = stores();


 $: isActiveTag = (tag) => $activeFilters.test_tags.includes(tag);
 $: endpoint = $breadcrumb[2] || 'this Endpoint';

 function toggleFilter (tag) {
   let testTags = $activeFilters.test_tags;
   let activeFilter = isActiveTag(tag);
   testTags = activeFilter
            ? testTags.filter(t => t !== tag)
            : testTags.concat(tag);
   let queryParams = updateQueryParams($page, {test_tags: [...testTags]});
   let url = `${$page.path}${queryParams}#tests`;
   activeFilters.update(af => ({...af, test_tags: testTags}))
   document.getElementById('tests').scrollIntoView();
   goto(url)
     .then(() => {
       document.getElementById('tests').scrollIntoView();
     });
 };

</script>

{#if $testsForEndpoint.length > 0 }
<div id='tests'>
  <h2>Tests for {$breadcrumb[2]}</h2>
  <div class='tag-filter'>
    <p>filter by test tag:</p>
    <ul>
      {#each $testTagsForEndpoint as testTag}
      <li class:active={isActiveTag(testTag)} on:click={() => toggleFilter(testTag)}>{testTag}</li>
      {/each}
    </ul>
  </div>
  <ul id='tests'>
    {#each $filteredTests as fTest}
    <li>{fTest.test}</li>
    {/each}
  </ul>
</div>
{/if}


<style>

 div#tests {
   min-height: 100vh;
 }

 div.tag-filter {
   padding: 0.55em;
   border: 1px solid #cccccc;
   font-size: 0.9em;
 }

 div.tag-filter p {
   font-variant-caps: small-caps;
   font-weight: 800;
 }

 div.tag-filter ul {
   display: flex;
   flex-wrap: wrap;
   list-style-type: none;
   padding-left: 0;
 }

 div.tag-filter li {
   margin: 0.25em;
   background: #f4f4f4;
   cursor: pointer;
   font-weight: 200;
 }

 div.tag-filter li.active {
   font-weight: 500;
   background: #96ccff;
   color: #001B44;
 }
</style>
