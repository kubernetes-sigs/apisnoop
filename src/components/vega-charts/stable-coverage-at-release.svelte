<script>
 import { afterUpdate, createEventDispatcher } from 'svelte';
 import { default as embed } from 'vega-embed';
 import { stableCoverageAtRelease } from '../../store';
 import Link from '../icons/link-solid.svelte';

 const dispatch = createEventDispatcher();
 const handleSwitch = (type) => dispatch('CHART_TYPE_SWITCHED', {chart: 'relchart', type});

 export let chartType = 'number';

 $: y = chartType === 'percentage'
      ? {
        "field": "total",
        "type": "quantitative",
        "aggregate": "sum",
        "stack": "normalize",
        "title": "Percentage Of Coverage",
        "axis":{
          "labelFontSize": 16,
          "titleFontSize": 16,
          "titlePadding": 8}
      }
      : {
          "field": "total",
          "type": "quantitative",
          "title": "Total Stable Endpoints",
          "axis":{
            "labelFontSize": 16,
            "titleFontSize": 16,
            "titlePadding": 8
        }}

   $: spec = {
     "data": {
       "values": $stableCoverageAtRelease,
     },
     "width": "900",
     "height": "600",
     "encoding": {
       "href": {"field":"href"},
       "x": {
         "field": "release",
         "type": "nominal",
         "sort": null,
         "axis":{
           "labelFontSize": 16,
           "titleFontSize": 16,
           "titlePadding": 8
         }
       },
       "y": y,
       "color": {
         "field": "type",
         "type": "nominal",
         "scale": {"range": [
                  "hsl(158, 74.2%, 48.0%)",
                  "hsl(30, 100%, 70.6%)",
                  "hsl(158, 74.2%, 38.0%)",
                  "hsl(158, 74.2%, 28.0%)",
                  "hsl(30, 100%, 60.6%)"
                  ]},
         "legend": {"labelFontSize": 14, "orient": "right", "direction": "vertical", "labelLimit": 300}
       },
       "tooltip": [
         {"field": "type", "type": "ordinal"},
         {"field": "total", "type": "quantitative"}
       ],
       "order": {"field": "order"},
       "legend": {"labelFontSize": 16}
     },
     "mark": {"type": "bar"}
   }
 afterUpdate(async() => {
   embed("#stable-coverage-at-release_chart", spec, {actions: true})
     .catch(err => console.log('error in stable over time', err));
 });

</script>

<section id="coverage-at-time-of-release">
  <h2><a href="conformance-progress#coverage-at-time-of-release">Stable Endpoint Coverage At Time of Release <Link width="1.25rem" /> </a></h2>
  <em>Per release, how many endpoints were introduced with tests and, regrettably, without tests? What work was done to decrease technical debt by adding new tests for old endpoints? What was the overall state of coverage at the time of the release?</em>

  {#if $stableCoverageAtRelease.length === 0}
    <div id='stable-coverage-at-release_chart'>
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
    <div id='stable-coverage-at-release_chart'></div>
  {/if}
</section>

<style>
 section {
   margin-top: 2rem;
 }

 div#stable-coverage-at-release_chart {
   margin-top: 2rem;
 }

 p {
   margin-top: 0;
 }
</style>
