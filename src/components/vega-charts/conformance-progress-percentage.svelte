<script>
 import { onMount} from 'svelte';
 import { default as embed } from 'vega-embed';

 export let data;
 $: spec = {
   "data": {
     "values": data,
   },
   "width": "900",
   "height": "600",
   "encoding": {
     "x": {
       "field": "release",
       "type": "nominal",
       "sort": null,
       "axis":{
         "labelFontSize": 16,
         "titleFontSize": 18,
         "titlePadding": 8
       }
     },
     "y": {
       "aggregate": "sum",
       "field": "total",
       "type": "quantitative",
       "stack": "normalize",
       "title": "Percentage of Coverage",
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
                "hsl(158, 74.2%, 48.0%)",
                "hsl(158, 74.2%, 38.0%)",
                "hsl(3, 100%, 60.6%)"
                ]},
       "legend": {"labelFontSize": 14, "labelLimit": 300}
     },
     "order": {"field": "order"},
   },
   "mark": {"type": "bar", "tooltip": true}
 };

 onMount(() => {
   embed("#conformance-progress-percentage_chart", spec, {actions: true})
     .catch(err => console.log('error in still untested chart', err));
 })
 {
 }
</script>

<div id="conformance-progress-percentage_chart"></div>

<style>
 div {
   margin-top: 2rem;
 }
</style>
