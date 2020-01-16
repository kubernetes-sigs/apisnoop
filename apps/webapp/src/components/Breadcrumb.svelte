<script>
 import { afterUpdate } from 'svelte';
 import { breadcrumb, opIDs } from '../stores';
 import { levelColours, categoryColours, endpointColour } from '../lib/colours.js';

 $: [level , category , endpoint] = $breadcrumb;
 $: lColour = levelColours[level] || 'white';
 $: cColour = categoryColours[category] || 'white';
 $: eColour = $opIDs[endpoint]
            ? endpointColour($opIDs[endpoint]) 
            : 'white';
 $: eText = $opIDs[endpoint]
          ? $opIDs[endpoint]['tested'] ? endpointColour($opIDs[endpoint]) : 'gray'
          : 'white';

</script>

<div id='breadcrumb'>
    <p><span style='border-color: {lColour}; background-color: {lColour};'>{level}</span><span style='background-Color: {cColour}; border-color: {cColour};'>{category}</span><span style='border-color: {eColour}; color: {eText};'>{endpoint}</span></p>
</div>

<style>
 div{
     height: 3em;
     grid-column: 1/3;
     margin-bottom: 0;
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

