<script>
 import * as d3 from 'd3';
 import { sunburst } from '../stores';
 import { onMount, afterUpdate } from 'svelte';
 import {
     dropRight,
     last,
     split,
     join,
     find,
     head,
     tail,
     reverse
 } from 'lodash-es';
 import { goto, stores } from '@sapper/app';
 import {
     activeBucketAndJob,
     activePath,
     breadcrumb
 } from '../stores';

 const { page } = stores();

 $: data = $sunburst;
 $: bucket = $activeBucketAndJob.bucket;
 $: job = $activeBucketAndJob.job;
 $: ([level, category, endpoint] = $breadcrumb);
 $: segments = [level, category, endpoint];
 $: sequenceArray = [];

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

 function determineDepth (node, depth) {
     return node.depth === 0
          ? depth
          : determineDepth(node.parent, [node.data.name, ...depth]);
 };

 function cleanSegments (data, segments, clean) {
     // given an array of url segments and data with nested children
     // check whether segment matches the name of at least one of the children at respective depth.
     // returning only valid segments.
     if (segments.length === 0) {
         return clean;
     } else  {
         let children = data.children.map(child => child.name);
         let isValid = children.includes(head(segments));
         if (!isValid) {
             return clean
         } else {
             data = data.children.find(o => o.name === head(segments));
             clean = clean.concat(head(segments));
             segments= tail(segments);
             return cleanSegments(data, segments, clean);
         }
     }
 };

 function findNodeAtCurrentDepth (segments, data) {
     if (segments.length === 0 ) {
         return data;
     } else {
         let nextDepth = data.children
                       ? data.children.find(child => child.data.name === head(segments))
                       : data.data.name;
         return findNodeAtCurrentDepth(tail(segments), nextDepth);
     }
 };

 function arcVisible(d) {
     return d.y1 <= 4 && d.y0 >= 1 && d.x1 > d.x0;
 }

 function setOpacity (d) {
     // take node data, d, and determine its opacity based on if its visible and active
     if (!arcVisible(d.current)) {
         // fade completely if we zoomed past the node
         return 0;
     } else if (sequenceArray.length > 0) {
         // if we've moused over set opacity based on mouse position
         return sequenceArray.indexOf(d) >= 0
              ? 1
              : 0.3
     } else if (endpoint !== '') {
         // if we are zoomed to endpoint, fade all other endpoints but that one
         return d.current.data.name === endpoint ? 1 : 0.3
     }else {
         // otherwise keep default opacity
         return 1;
     }
 }

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

 $: validSegments = cleanSegments(data, segments, []);
 $: partition = data => {
     const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => (b.data.tested - a.data.tested))
                    .sort((a, b) => (b.data.conf_tested - a.data.tested));
     return d3.partition()
              .size([2 * Math.PI, root.height + 1])
     (root);
 }
 $: root = partition(data).each(d=> d.current = d);
 $: nodes = root
     .descendants()
     .slice(1)
     .map((node) => {
         // take node data, d, and determine its opacity based on if its visible and active
         let currentOpacity = 1;
         if (!arcVisible(node.current)) {
             currentOpacity = 0;
             return {...node, currentOpacity};
         } else if (sequenceArray.length > 0) {
             currentOpacity = sequenceArray.indexOf(node) >= 0
                            ? 1
                            : 0.3
             return {...node, currentOpacity};
         } else if (endpoint !== '') {
             // if we are zoomed to endpoint, fade all other endpoints but that one
             currentOpacity = node.current.data.name === endpoint
                            ? 1
                            : 0.3
             return {...node, currentOpacity};

         }else {
             // otherwise keep default opacity
             return {...node, currentOpacity}
         }
     })
 $: cleanCurrentDepth = cleanSegments(data, $activePath, []);
 $: nodeAtCurrentDepth = findNodeAtCurrentDepth(cleanCurrentDepth, root);
</script>

<div class="chart2">
        <svg viewBox="0,0,932,932" style="font: 12px sans-serif;">
            <g
                transform="translate({width/2},{width/2})"
                on:mouseleave={mouseLeave}>
                <g>
                {#each nodes as node}
                    <path
                        fill={node.data.color}
                        fill-opacity={node.currentOpacity}
                        d={arc(node.current)}
                        on:mouseover={() => mouseOver(node.current)}
                        style="cursor: pointer;"
                        on:click={() => node.children ? clicked(node) : endpointClicked(node)}
                        />
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
