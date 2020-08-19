<script>
 import { afterUpdate, createEventDispatcher } from 'svelte';
 import { default as embed } from 'vega-embed';
 import { coverageByRelease } from '../../store';
 import { conformanceColours } from '../../lib/colours.js';
 import Link from '../icons/link-solid.svelte';

 const { tested, untested } = conformanceColours;

 const dispatch = createEventDispatcher();
 const handleSwitch = (type) => dispatch('CHART_TYPE_SWITCHED', {chart: 'relchart', type});

 export let chartType = 'number';

 $: x = chartType === 'percentage'
      ? {
        "field": "total",
        "type": "quantitative",
        "aggregate": "sum",
        "stack": "normalize",
        "title": "Percentage of Coverage From This Release",
        "axis":{
          "labelFontSize": 16,
          "titleFontSize": 16,
          "titlePadding": 8}
      }
      : {
        "field": "total",
        "type": "quantitative",
        "title": "Untested & Tested Endpoints From This Release",
        "axis":{
          "labelFontSize": 16,
          "titleFontSize": 16,
          "titlePadding": 8
      }}

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
     "x": x,
     "tooltip": [
       {"field": "type", "type": "ordinal"},
       {"field": "total", "type": "quantitative"}
     ],
     "color": {
       "field": "type",
       "type": "nominal",
       "scale": {"range": [
                tested,
                untested
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
  <em>For the endpoints promoted in a release, how many are tested and untested as of today?</em>
  <p><b>Note:</b> We mark still untested endpoints as a negative number, since they represent technical debt.</p>

  {#if $coverageByRelease.length === 0}
    <div id="coverage-by-release_chart">
      <p>loading chart...</p>
    </div>
  {:else}
    <div class="chart-type" >
      <strong>View As:</strong>
      <div>
        <input on:click="{()=>handleSwitch('number')}" type="radio" id="number" name="chart-type" bind:group={chartType} value="number">
        <label for="number">Number</label>
      </div>
      <div>
        <input on:click="{()=>handleSwitch('percentage')}" type="radio" id="percentage" name="chart-type" bind:group={chartType} value="percentage">
        <label for="percentage">Percentage</label>
      </div>
    </div>
    <div id="coverage-by-release_chart"></div>
  {/if}
</section>

<style>
 section {
   margin-top: 2rem;
 }

 div#coverage-by-release_chart {
   margin-top: 2rem;
 }

 p {
   margin-top: 0;
 }

</style>
