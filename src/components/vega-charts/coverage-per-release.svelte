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
       "scale": {"range": ["#19A974","#FF4136"]},
       "legend": {"labelFontSize": 16}
     }
   },
   "mark": {"type": "bar", "tooltip": true}
 };

 onMount(() => {
   embed("#coverage-per-release_chart", spec, {actions: true})
     .catch(err => console.log('error in still untested chart', err));
 })
 {
 }
</script>

<div id="coverage-per-release_chart"></div>

<style>
 div {
   margin-top: 2rem;
 }
</style>
