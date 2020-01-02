<script>
 import * as d3 from 'd3';
 import { sunburst } from '../stores';
 import { onMount, afterUpdate } from 'svelte';

 let sequence;
 let chart;

 let data = $sunburst;

 const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
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
      .attr("d", d => arc(d.current));

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

  chart.append(svg.node());
})

 console.log({data, sunburst: $sunburst});

</script>

<div bind:this={sequence} class="sequence"></div>
<div bind:this={chart} class="chart"></div>
