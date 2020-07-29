<script>
 import { afterUpdate } from 'svelte';
 import { stableCoverageAtRelease } from '../../store';
 import { default as embed } from 'vega-embed';
 import Link from '../icons/link-solid.svelte';

 $: chartType = 'number';

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

 afterUpdate(async() => {
   let spec = {
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
   embed("#stable-coverage-at-release", spec, {actions: true})
     .catch(err => console.log('error in stable over time', err));
 });

</script>

<section id="coverage-at-time-of-release">
  <h2><a href="conformance-progress#coverage-at-time-of-release">Stable Endpoint Coverage At Time of Release <Link width="1.25rem" /> </a></h2>
  <em>How many endpoints were introduced in a release, and how many came in with tests?  What was the conformance coverage at the time of this release?</em>

  {#if $stableCoverageAtRelease.length === 0}
    <p>loading chart...</p>
  {:else}
    <div class="'chart-type" >
    <strong>View As:</strong>
    <div>
      <input type="radio" id="number" name="chart-type" bind:group={chartType} value="number">
      <label for="number">Number</label>
    </div>
    <div>
      <input type="radio" id="percentage" name="chart-type" bind:group={chartType} value="percentage">
      <label for="percentage">Percentage</label>
    </div>
    </div>
    <div id='stable-coverage-at-release'></div>
  {/if}
</section>

<style>
 div#stable-coverage-at-release {
   margin-top: 2rem;
 }
</style>
