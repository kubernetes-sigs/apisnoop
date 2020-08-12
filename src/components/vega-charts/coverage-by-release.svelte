<script>
 import { afterUpdate } from 'svelte';
 import { default as embed } from 'vega-embed';
 import { coverageByRelease } from '../../store';
 import Link from '../icons/link-solid.svelte';

 $: spec = {
   "data": {
     "values": $coverageByRelease,
   },
   "width": "900",
   "height": "600",
   "encoding": {
     "y": {
       "field": "release",
       "type": "nominal",
       "sort": null,
       "axis":{
         "labelFontSize": 16,
         "titleFontSize": 18,
         "titlePadding": 8
       }
     },
     "x": {
       "field": "total",
       "type": "quantitative",
       "title": "Untested & Tested Endoints From this Release",
       "axis":{
         "labelFontSize": 16,
         "titleFontSize": 18,
         "titlePadding": 8
       }
     },
     "tooltip": [
       {"field": "type", "type": "ordinal"},
       {"field": "total", "type": "quantitative"}
     ],
     "color": {
       "field": "type",
       "type": "nominal",
       "scale": {"range": [
                "hsl(158, 74.2%, 38.0%)",
                "hsl(30, 100%, 60.6%)"
                ]},
       "legend": {"labelFontSize": 16}
     }
   },
   "mark": {"type": "bar", "tooltip": true}
 };

 afterUpdate(() => {
   embed("#coverage-by-release_chart", spec, {actions: true})
     .catch(err => console.log('error in still untested chart', err));
 })
 {
 }
</script>

<section id="coverage-by-release">
  <h2><a href="conformance-progress#coverage-by-release">Conformance Coverage By Release <Link width="1.25rem"/></a></h2>
  <em>Per release, for the endpoints promoted in this release, how many are tested or untested today?</em>
  <p><b>Note:</b> We mark the number of still untested endpoints as a negative number, since they represent technical debt.</p>

  {#if $coverageByRelease.length === 0}
    <div id="coverage-by-release_chart">
      <p>loading chart...</p>
    </div>
  {:else}
    <div id="coverage-by-release_chart"></div>
  {/if}
</section>

<style>
 section {
   margin-top: 2rem;
 }
 div {
   margin-top: 2rem;
 }
 p {
   margin-top: 0;
 }
</style>
