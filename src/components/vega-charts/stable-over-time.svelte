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
         "scale": {"range": [
                  "hsl(158, 74.2%, 48.0%)",
                  "hsl(53, 91.1%, 82.4%)",
                  "hsl(158, 74.2%, 38.0%)",
                  "hsl(158, 74.2%, 28.0%)",
                  "hsl(3, 100%, 60.6%)"
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
   embed("#stable-over-time", spec, {actions: true})
     .catch(err => console.log('error in stable over time', err));
 });

</script>

<div id="stable-over-time"></div>

<style>
 div {
   margin-top: 2rem;
 }
</style>
