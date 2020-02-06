<script>
 import { afterUpdate } from 'svelte';
 import { breadcrumb, mouseOverPath, opIDs } from '../stores';
 import { levelColours, categoryColours, endpointColour } from '../lib/colours.js';

 $: [level, category, operation_id] = $breadcrumb;
 $: lColour = levelColours[level] || 'white';
 $: cColour = categoryColours[category] || 'white';
 $: eColour = $opIDs[operation_id]
            ? endpointColour($opIDs[operation_id]) 
            : 'white';
 $: eTextColour = $opIDs[operation_id]
          ? $opIDs[operation_id]['tested'] ? endpointColour($opIDs[operation_id]) : 'gray'
          : 'white';

 afterUpdate(() => console.log('crumbs', $breadcrumb));
</script>

<div id='breadcrumb'>
  {#if $mouseOverPath.length > 0}
  <p>{#if level}<span style='border-color: {lColour}; background-color: {lColour};'>{level}</span>{/if}{#if category}<span style='background-Color: {cColour}; border-color: {cColour};'>{category}</span>{/if}{#if operation_id}<span style='border-color: {eColour}; color: {eTextColour};'> {operation_id}</span>{/if}</p>
  {/if}
</div>

<style>
 div{
     height: 3em;
     grid-column: 1/2;
     margin-bottom: 1em;
 }
 p {
     font-size: 1.3em;
     font-color: aliceblue;
 }
 span {
     margin: 0;
     color: #EEEEEE;
     padding: 0.25em;
     border: 1px solid;
 }
</style>

