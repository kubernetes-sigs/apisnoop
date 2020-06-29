<script>
 import * as d3 from 'd3';
 import { goto } from '@sapper/app';
 import {
   compact,
   join
 } from 'lodash-es';
 import {
   release,
   activeFilters,
   mouseOverPath,
   zoomedSunburst
 } from '../../store';
 import { createEventDispatcher } from 'svelte';
 const dispatch = createEventDispatcher();
 $: activeDepth = determineDepth($activeFilters);

 const format = d3.format(",d")
 const width = 932
 const radius = width / 8
 const arc = d3.arc()
               .startAngle(d => d.x0)
               .endAngle(d => d.x1)
               .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
               .padRadius(radius * 1.5)
               .innerRadius(d => d.y0 * radius)
               .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

 function determineDepth (filters) {
   // check out depth based on which filters are set.
   let { level, category, endpoint } = filters;
   let setFilters = compact([level, category, endpoint]) // compact will remove falsy values.
   if (setFilters.length === 3) {
     return 'endpoint'
   } else if (setFilters.length === 2) {
     return 'category';
   } else if (setFilters.length === 1) {
     return 'level';
   } else {
     return 'root'
   }
 };

 function depthUp () {
   // reset the activeFilter for whatever is our current depth.  
   // This will cause the sunburst to expand to the next previous filter, going up a level.
   let {
     release: version
   } = $release;
   $mouseOverPath = [];
   if (activeDepth === 'root') {
     return null
   } else if (activeDepth === 'endpoint') {
     $activeFilters['endpoint'] = '';
     $activeFilters['category'] === '';
   } else {
     $activeFilters[activeDepth] = '';
   }
   dispatch('newPathRequest', { params: {version, ...$activeFilters }})
 };

 function labelVisible(d) {
   return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
 }

 function labelTransform(d) {
   const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
   const y = (d.y0 + d.y1) / 2 * radius;
   return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
 }

 function mouseOver(d) {
   $mouseOverPath = d.ancestors().reverse().slice(1);
 }

 function mouseLeave () {
   $mouseOverPath = [];
 }

 function clicked (node, e) {
   // upon clicking of a node, update the active filters and url.
   let {
     release: version
   } = $release;
   let {
     level,
     category,
     endpoint
   } = node.data;
   let params = { version, level, category, endpoint}
   dispatch('newPathRequest', { params })
 };

 function setURL () {
   // push state without triggering a reload, using our active filters in order.
   // this assumes that activeFilters were set correctly before calling this function.
   let {
     level,
     category,
     endpoint
   } = $activeFilters;
   let filterSegments = compact([$release.release, level, category, endpoint]);
   let urlPath = join([...filterSegments], '/');
   goto(urlPath);
 };

 $: partition = data => {
   const root = d3.hierarchy(data)
                  .sum(d => d.value)
                  .sort((a, b) => (b.data.tested - a.data.tested))
                  .sort((a, b) => (b.data.conf_tested - a.data.tested));
   return d3.partition()
            .size([2 * Math.PI, root.height + 1])
   (root);
 }
 $: root = partition($zoomedSunburst).each(d=> d.current = d);
 $: nodes = root
   .descendants()
   .slice(1)
   .map((node) => {
     // take node and determine its opacity based on if its visible and active
     let currentOpacity = 1;
     if ($activeFilters.endpoint !== '' && node.data.endpoint !== '') {
       // if you and endpoint and we've filtered to endpoint, fade yrself if you aren't the filtered endpoint.
       currentOpacity = ($activeFilters.endpoint === node.data.name)
                      ? 1
                      : 0.3
     }
     if ($mouseOverPath.length > 0) {
       currentOpacity = ($mouseOverPath.indexOf(node) >= 0 || $activeFilters.endpoint === node.data.name)
                      ? 1
                      : 0.3
     }
     return {...node, currentOpacity};
   })
</script>
<div class="chart">
  <svg viewBox="0,0,932,932" style="font: 12px sans-serif;" on:mouseleave={mouseLeave} id='sunburst'>
    <g transform="translate({width/2},{width/2})" id='big-g'>
      <g>
        {#each nodes as node}
        <path
          fill={node.data.color}
          fill-opacity={node.currentOpacity}
          d={arc(node.current)}
          on:mouseover={() => mouseOver(node.current)}
          style="cursor: pointer;"
          on:mousedown={(e)=> clicked(node, e)} />
        {/each}
      </g>
      <g pointer-events='none' text-anchor='middle' style='user-select: none;'>
        {#each nodes as node}
        <text
          dy='0.35em'
          fill-opacity = {+labelVisible(node.current)}
          transform = {labelTransform(node.current)}
        >
          {node.children ? node.data.name : ''}
        </text>
        {/each}
      </g>
      <circle
        r={radius}
        fill={root.data.color}
        pointer-events="all"
        on:click={depthUp}
      />

      <text
        text-anchor='middle'
        font-size='2em'
        fill='white'
        transform={$activeFilters.category.length > 0 ? "translate(0, -15)" : ""} >
        {$activeFilters.level}
      </text>
      <text
        text-anchor='middle'
        font-size='2em'
        fill='white'
        transform="translate(0,15)">
        {$activeFilters.category}
      </text>
    </g>
  </svg>
</div>

<style>
 .chart {
   position: relative;
   grid-column: 1;
 }
</style>
