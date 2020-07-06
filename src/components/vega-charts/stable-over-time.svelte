<script>
 import { onMount } from 'svelte';
 import { default as embed } from 'vega-embed';

 export let data;

 onMount(async() => {
   let spec = {
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
           "titleFontSize": 16,
           "titlePadding": 8
         }
       },
       "y": {
         "field": "total",
         "type": "quantitative",
         "title": "Total Stable Endpoints",
         "axis":{
           "labelFontSize": 16,
           "titleFontSize": 16,
           "titlePadding": 8
         }
       },
       "color": {
         "field": "type",
         "type": "nominal",
         "scale": {"range": ["#9EEBCF", "#FBF1A9", "#19A974", "#FF4136"]},
         "legend": {"labelFontSize": 16}
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
   embed("#stable-over-time", spec, {actions: true})
     .catch(err => console.log('error in stable over time', err));
 });

</script>

<div id="stable-over-time"></div>

