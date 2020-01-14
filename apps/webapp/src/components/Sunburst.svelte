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

 import { activeBucketAndJob, currentDepth } from '../stores';
 const { page } = stores();
 let sequence;
 let chart;
 let data = $sunburst;

 $: bucket = $activeBucketAndJob.bucket;
 $: job = $activeBucketAndJob.job;

 $: level = $currentDepth[0] || '';
 $: category = $currentDepth[1] || '';
 $: endpoint = $currentDepth[2] || '';

 $: segments = [level, category, endpoint];

 $: sunburstLoaded = false;

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

 function cleanSegments (data, segments, clean) {
     // given an array of url segments and data with nested children
     // check whether segment matches the name of at least one of the children at respective depth.
     // returning only valid segments.
     if (segments.length === 0 || !data.children) {
         return clean
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

 function filterDataBySegments (data, segments) {
     // given an array of url segments, filter tree data where
     // each child object matches the name for its respective segment.
     if (segments.length === 0) {
         return data;
     } else {
         let nextLevel = data.children.find(o => o.name === head(segments))
         data = nextLevel.children
              ? nextLevel
              : data
         return filterDataBySegments(data, tail(segments))
     }
 };

 function findNodeAtCurrentDepth (segments, data) {
     if (segments.length === 0 || !data.children) {
         return data;
     } else {
         let nextDepth = data.children.find(child => child.data.name === head(segments));
         return findNodeAtCurrentDepth(tail(segments), nextDepth);
     }
 };

 onMount(()  => {
     let validSegments = cleanSegments(data, segments, []);
     /* data = filterDataBySegments(data, validSegments); */
     const partition = data => {
         const root = d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a, b) => (b.data.tested - a.data.tested))
                        .sort((a, b) => (b.data.conf_tested - a.data.tested));
         return d3.partition()
                  .size([2 * Math.PI, root.height + 1])
         (root);
     }
     const root = partition(data);
     root.each(d => d.current = d);
     let cleanCurrentDepth = cleanSegments(data, $currentDepth, []);
     let nodeAtCurrentDepth = findNodeAtCurrentDepth(cleanCurrentDepth, root);

     const svg = d3.create("svg")
                   .attr("viewBox", [0, 0, width, width])
                   .style("font", "12px sans-serif");

     const g = svg.append("g")
                  .attr("transform", `translate(${width / 2},${width / 2})`);

     const path = g.append("g")
                   .selectAll("path")
                   .data(root.descendants().slice(1))
                   .join("path")
                   .attr("fill", d => d.data.color)
                   .attr("fill-opacity", d => {
                       if (!arcVisible(d.current)) {
                           return 0;
                       } else {
                           if (endpoint !== '') {
                               return d.current.data.name === endpoint ? 1 : 0.3
                           } else {
                               return 1;
                           }
                       }
                   })
                   .attr("d", d => arc(d.current))
                   .on("mouseover", mouseover);

     path.filter(d => d.children)
         .style("cursor", "pointer")
         .on("click", clicked);

     path.filter(d => !d.children)
         .style("cursor", "pointer")
         .on("click", endpointClicked);

     path.append("title")
         .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

     const label = g.append("g")
                    .attr("pointer-events", "none")
                    .attr("text-anchor", "middle")
                    .style("user-select", "none")
                    .selectAll("text")
                    .data(root.descendants().slice(1))
                    .join("text")
                    .attr("dy", "0.35em")
                    .attr("fill-opacity", d => +labelVisible(d.current))
                    .attr("transform", d => labelTransform(d.current))
                    .text(d => d.children ? d.data.name : '');

     const parent = g.append("circle")
                     .datum(root)
                     .attr("r", radius)
                     .attr("fill", root.data.color)
                     .attr("pointer-events", "all")
                     .on("click", clicked)

     function endpointClicked (p) {
         let ep = p.data;
         let urlPath = join(['coverage', bucket, job, ep.level, ep.category, ep.name], '/');
         path.filter(d => !d.children)
             .attr("fill-opacity", (d) => d.data.name === p.data.name ? 1 : 0.3);
         goto(urlPath);
     };

     function zoomToCurrentDepth(p) {
         parent.datum(p.parent || root);
         console.log({p, parent: parent.datum(), root});
         parent.attr("fill", p.data.color);
         root.each(d => d.target = {
             x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
             x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
             y0: Math.max(0, d.y0 - p.depth),
             y1: Math.max(0, d.y1 - p.depth)
         });

         const t = g.transition().duration(750);

         // Transition the data on all arcs, even the ones that aren’t visible,
         // so that if this transition is interrupted, entering arcs will start
         // the next transition from the desired position.
         path.transition(t)
             .tween("data", d => {
                 const i = d3.interpolate(d.current, d.target);
                 return t => d.current = i(t);
             })
             .filter(function(d) {
                 return +this.getAttribute("fill-opacity") || arcVisible(d.target);
             })
             .attr("fill-opacity", d => arcVisible(d.target) ? 1 : 0)
             .attrTween("d", d => () => arc(d.current));

         label.filter(function(d) {
             return +this.getAttribute("fill-opacity") || labelVisible(d.target);
         }).transition(t)
              .attr("fill-opacity", d => +labelVisible(d.target))
              .attrTween("transform", d => () => labelTransform(d.current));
     };


     function clicked(p) {
         zoomToCurrentDepth(p);
         function segmentNode (node, segments) {
             if (!node.parent) {
                 segments = node.data.name === 'root'
                          ? segments
                          : segments.concat(node.data.name);
                 return reverse(segments);
             } else {
                 segments = segments.concat(node.data.name);
                 return segmentNode(node.parent, segments);
                 }
             };

         function determineDepth (node, depth) {
             return node.depth === 0
                  ? depth
                  : determineDepth(node.parent, [node.data.name, ...depth]);
         };

         function determineRoute (page, segment) {
             let route;
             // Check whether  they've clicked the center node and zoom out a level if so.
             if (last(segment) === data.name) {
                 route = dropRight(page.path.split('/')).join('/')
             } else {
                 route = join(['coverage', bucket, job, ...nodeSegments], '/');
                 }
             return route;
         }

         setInnerText(p);
         let nodeSegments = segmentNode(p, []);
         let urlPath = determineRoute($page, nodeSegments);
         currentDepth.set(determineDepth(p, []));
         console.log({depth: determineDepth(p, []) , currentDepth: $currentDepth})
         goto(urlPath);
     }

     function setInnerText (p) {
         let level = d3.select("#level")
         let category = d3.select("#category")
         if (p.parent !== null) {
             level.text(p.parent.data.name === "root" ? p.data.name : p.parent.data.name)
             category.text(p.parent.data.name === "root" ? "" : p.data.name)
         } else {
             level.text(p.data.name === "root" ? '' : p.data.name)
             category.text("")
         }
     };

     function arcVisible(d) {
         return d.y1 <= 4 && d.y0 >= 1 && d.x1 > d.x0;
     }

     function labelVisible(d) {
         return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
     }

     function labelTransform(d) {
         const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
         const y = (d.y0 + d.y1) / 2 * radius;
         return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
     }

     // Thank you, Kerry Rodan

     function mouseover(d) {
         let sequenceArray = d.ancestors().reverse().slice(1);
         // Fade all the segments.
         d3.selectAll("path")
           .style("opacity", 0.3);

         // Then highlight only those that are an ancestor of the current segment.
         d3.selectAll("path")
           .filter((node) => (sequenceArray.indexOf(node) >= 0))
           .style("opacity", 1);
     }

     // Restore everything to full opacity when moving off the visualization.
     function mouseleave(d) {
         // Deactivate all segments during transition.
         d3.selectAll("path").on("mouseover", null);

         // Transition each segment to full opacity and then reactivate it.
         d3.selectAll("path")
           .transition()
           .duration(1000)
           .style("opacity", 1)
           .on("end", function() {
               d3.select(this).on("mouseover", mouseover);
           });
     }

     chart.append(svg.node());
     d3.select(chart).on("mouseleave", mouseleave);
     sunburstLoaded = true;
     zoomToCurrentDepth(nodeAtCurrentDepth);
 })

</script>

{#if !sunburstLoaded}
    <p>loading...</p>
{/if}

<div bind:this={chart} class="chart">
    <div id="explanation">
        <p id="level">{level}</p>
        <p id="category">{category}</p>
    </div>
</div>


<style>
 .chart {
     position: relative;
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
