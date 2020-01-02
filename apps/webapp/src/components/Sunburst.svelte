<script>
 import * as d3 from 'd3';
 import { sunburst } from '../stores';
 import { onMount, afterUpdate } from 'svelte';

 let sequence;
 let chart;

 let data = $sunburst;

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

 // for our breadcrumb sequence
 var b = {
     w: 75,
     h: 30,
     s: 3,
     t: 10
 };

 onMount(()  => {
     const partition = data => {
         const root = d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a, b) => b.data.test_hits - a.data.test_hits);
         return d3.partition()
                  .size([2 * Math.PI, root.height + 1])
         (root);
     }
     const root = partition(data);
     root.each(d => d.current = d);

     const svg = d3.create("svg")
                   .attr("viewBox", [0, 0, width, width])
                   .style("font", "10px sans-serif");

     const g = svg.append("g")
                  .attr("transform", `translate(${width / 2},${width / 2})`);

     const path = g.append("g")
                   .selectAll("path")
                   .data(root.descendants().slice(1))
                   .join("path")
                   .attr("fill", d => d.data.color)
                   .attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0)
                   .attr("d", d => arc(d.current))
                   .on("mouseover", mouseover);

     path.filter(d => d.children)
         .style("cursor", "pointer")
         .on("click", clicked);

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
                     .on("click", clicked);

     function clicked(p) {
         parent.datum(p.parent || root);
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
             .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
             .attrTween("d", d => () => arc(d.current));

         label.filter(function(d) {
             return +this.getAttribute("fill-opacity") || labelVisible(d.target);
         }).transition(t)
              .attr("fill-opacity", d => +labelVisible(d.target))
              .attrTween("transform", d => () => labelTransform(d.current));
     }

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

         var sequenceArray = d.ancestors().reverse();
         sequenceArray.shift(); // remove root node from the array
         updateBreadcrumbs(sequenceArray);

         // Fade all the segments.
         d3.selectAll("path")
           .style("opacity", 0.3);

         // Then highlight only those that are an ancestor of the current segment.
         chart.selectAll("path")
            .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);
     }

     // Restore everything to full opacity when moving off the visualization.
     function mouseleave(d) {

         // Hide the breadcrumb trail
         d3.select("#trail")
           .style("visibility", "hidden");

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

     function initializeBreadcrumbTrail() {
         // Add the svg area.
         var trail = d3.select(sequence).append("svg:svg")
                       .attr("width", width)
                       .attr("height", 50)
                       .attr("id", "trail");
         // Add the label at the end, for the percentage.
         trail.append("svg:text")
              .attr("id", "endlabel")
              .style("fill", "#000");
     }

     // Generate a string that describes the points of a breadcrumb polygon.
     function breadcrumbPoints(d, i) {
         var points = [];
         points.push("0,0");
         points.push(b.w + ",0");
         points.push(b.w + b.t + "," + (b.h / 2));
         points.push(b.w + "," + b.h);
         points.push("0," + b.h);
         if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                    points.push(b.t + "," + (b.h / 2));
                    }
         return points.join(" ");
     }

     // Update the breadcrumb trail to show the current sequence and percentage.
     function updateBreadcrumbs(nodeArray) {

         // Data join; key function combines name and depth (= position in sequence).
         var trail = d3.select("#trail")
                       .selectAll("g")
                       .data(nodeArray, function(d) { return d.data.name + d.depth; });

         // Remove exiting nodes.
         trail.exit().remove();

         // Add breadcrumb and label for entering nodes.
         var entering = trail.enter().append("svg:g");

         entering.append("svg:polygon")
                 .attr("points", breadcrumbPoints)
                 .style("fill", function(d) { return d.data.color; });

         entering.append("svg:text")
                 .attr("x", (b.w + b.t) / 2)
                 .attr("y", b.h / 2)
                 .attr("dy", "0.35em")
                 .attr("text-anchor", "middle")
                 .text(function(d) { return d.data.name; });

         // Merge enter and update selections; set position for all nodes.
         entering.merge(trail).attr("transform", function(d, i) {
             return "translate(" + i * (b.w + b.s) + ", 0)";
         });

         // Make the breadcrumb trail visible, if it's hidden.
         d3.select("#trail")
           .style("visibility", "");

     }

     chart.append(svg.node());
     d3.select(chart).on("mouseleave", mouseleave);
     initializeBreadcrumbTrail();
 })

 console.log({data, sunburst: $sunburst});

</script>

<div bind:this={sequence} class="sequence"></div>
<div bind:this={chart} class="chart"></div>
