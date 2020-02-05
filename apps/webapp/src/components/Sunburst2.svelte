<script>
 import * as d3 from 'd3';
 import {
   compact,
   join
 } from 'lodash-es';
 import {
   activeBucketAndJob,
   activeFilters,
   zoomedSunburst
 } from '../stores';

 $: sequenceArray = [];
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
   let { level, category, operation_id } = filters;
   let setFilters = compact([level, category, operation_id]) // compact will remove falsy values.
   if (setFilters.length === 3) {
     return 'operation_id'
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
   sequenceArray = [];
   if (activeDepth === 'root') {
     return null
   } else if (activeDepth === 'operation_id') {
     $activeFilters['operation_id'] = '';
     $activeFilters['category'] === '';
     } else {
     $activeFilters[activeDepth] = '';
   }
   setURL();
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
   sequenceArray = d.ancestors().reverse().slice(1);
 }

 function mouseLeave () {
   sequenceArray = [];
 }

 function clicked (p) {
   // upon clicking of a node, update the active filters and url.
   let {
     bucket,
     job
   } = $activeBucketAndJob;
   let {
     level,
     category,
     operation_id
   } = p.data;
   activeFilters.update(af => ({...af, bucket, job, level, category, operation_id}));
   setURL();
 };

 function setURL () {
   // push state without triggering a reload, using our active filters in order.
   // this assumes that activeFilters were set correctly before calling this function.
   let {
     bucket,
     job,
     level,
     category,
     operation_id
   } = $activeFilters;
   let filterSegments = compact([bucket, job, level, category, operation_id]);
   let urlPath = join(['coverage', ...filterSegments], '/');
   history.pushState({}, '', urlPath);
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
     if ($activeFilters.operation_id !== '' && node.data.operation_id !== '') {
       // if you and endpoint and we've filtered to endpoint, fade yrself if you aren't the filtered endpoint.
       currentOpacity = ($activeFilters.operation_id === node.data.name)
                      ? 1
                      : 0.3
     }
     if (sequenceArray.length > 0) {
       currentOpacity = (sequenceArray.indexOf(node) >= 0 || $activeFilters.operation_id === node.data.name)
                      ? 1
                      : 0.3
     }
     return {...node, currentOpacity};
   })
</script>

<div class="chart2">
  <svg viewBox="0,0,932,932" style="font: 12px sans-serif;" on:mouseleave={mouseLeave}>
    <g transform="translate({width/2},{width/2})" id='big-g'>
      <g>
        {#each nodes as node}
        <path
          fill={node.data.color}
          fill-opacity={node.currentOpacity}
          d={arc(node.current)}
          on:mouseover={() => mouseOver(node.current)}
          style="cursor: pointer;"
          on:click={()=> clicked(node)} />
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

 #explanation {
   position: absolute;
   top: calc(100% / 2.25);
   left: 0;
   width: 100%;
   text-align: center;
   color: #eeeeee;
   z-index: 2;
   display: flex;
   flex-flow: column;
   justify-content: center;
   align-items: center;
 }

 @media(max-width: 667px) {
   #explanation {
     font-size: 0.75em;
   }
 }

 #level , #category {
   margin: 0;
   padding: 0;
 }
 #level {
   font-size: 1.5em;
 }
 #category {
   font-size: 1.25em;
 }
</style>
