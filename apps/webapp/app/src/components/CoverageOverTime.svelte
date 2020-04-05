<script>
 import dayjs from 'dayjs';
 import {
   first,
   last,
   isEmpty,
   uniqBy
 } from 'lodash-es';
 import { releasePrecision } from '../lib/helpers.js';
 import { afterUpdate } from 'svelte';
 import { scaleLinear, scaleTime } from 'd3-scale';
 import { prefetch, goto } from '@sapper/app';
 import {
   dates,
   coverage
 } from '../stores/coverage-over-time.js';
 import {
   bucketsAndJobs
 } from '../stores';

 const padding = { top: 20, right: 15, bottom: 20, left: 25 };
 // create an array of numbers from 0 to max, incremented by step
 const range = (max, step) => [...Array(max + 1).keys()].filter(n => n % step === 0)
 // y is total percentage, from 0 to 100
 const yTicks = range(50, 5);

 // Coverage is sorted by timestamp, with oldest at [0]
 // X ticks will be from oldest audit run to today.
 $: xTicks = [
   dayjs($coverage[0].timestamp).subtract(1, 'day'),
   dayjs().subtract(8, 'month'),
   dayjs().subtract(4, 'month'),
   dayjs().subtract(2, 'month'),
   dayjs().add(1,'week')
 ];

 let width = 900;
 let height = 600;

 $: activeJob = {};
 $: minX = dayjs(first($dates));
 $: maxX = dayjs(last($dates));
 $: xScale = scaleTime()
   .domain([minX, maxX])
   .range([padding.left, width - padding.right]);
 $: yScale = scaleLinear()
   .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
   .range([height - padding.bottom, padding.top]);

 $: testedPath = `M${$coverage.map(c => `${xScale(c.timestamp)},${yScale(c.percent_tested)}`).join('L')}`;
 $: testedArea = `${testedPath}L${xScale(maxX)}, ${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

 $: confPath = `M${$coverage.map(c => `${xScale(c.timestamp)},${yScale(c.percent_conf_tested)}`).join('L')}`;
 $: confArea = `${confPath}L${xScale(maxX)}, ${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

 $: releases = uniqBy($coverage
   .map(c => ({
     release: releasePrecision(c.release, 2),
     timestamp: c.timestamp
   })), 'release');

 afterUpdate(() => console.log({releases}));
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
  <svg>
    <!-- y axis -->
    <g class='axis y-axis' transform="translate(0, {padding.top})">
      {#each yTicks as tick}
      <g class="tick tick-{tick}" transform="translate(0, {yScale(tick) - padding.bottom})">
        <line x2="100%"></line>
        <text y="-4">{tick} {tick === 100 ? ' percent' : ''}</text>
      </g>
      {/each}
    </g>
    <!-- x axis -->
    <g class="axis x-axis">
      {#each xTicks as tick}
      <g class="tick tick-{ tick}" transform="translate({xScale(tick)},{height})">
        <line y1="-{height}" y2="-{padding.bottom}" x1="0" x2="0"></line>
        <text y="-2">{dayjs(tick).format('DD MMM, YY')}</text>
      </g>
      {/each}
    </g>
    <!-- Releases -->
    <g class="releases">
      {#each releases as r}
      <g class="release release-{r.release}" transform="translate({xScale(r.timestamp)},{height - 20})">
        <text y="-2">{r.release}</text>
      </g>
      {/each}
    </g>
    <path class='path-area' d={testedArea}></path>
    <path class='path-line' d={testedPath}></path>
    <path class='path-line conf' d={confPath}></path>
    <path class='path-area conf' d={confArea}></path>
    {#each $coverage as point}
    <circle
      cx='{xScale(point.timestamp)}'
      cy='{yScale(point.percent_tested)}'
      r='5'
      class='point'
      on:mouseover={() => {
      prefetch(`coverage/ci-kubernetes-e2e-gci-gce/${point.job}`)
      activeJob = point
      }}
      on:mouseleave={() => activeJob = {}}
      on:click={() => goto(`coverage/${point.bucket}/${point.job}`)}
    />
    <circle
      cx='{xScale(point.timestamp)}'
      cy='{yScale(point.percent_conf_tested)}'
      r='5'
      class='point conf'
      on:mouseover={() => {
      prefetch(`coverage/ci-kubernetes-e2e-gci-gce/${point.job}`)
      activeJob = point
      }}
      on:mouseleave={() => activeJob = {}}
      on:click={() => goto(`coverage/${point.bucket}/${point.job}`)}
    />
    {/each}
    {#if !isEmpty(activeJob)}
    <text
      transform="translate({width/2 + 50},{height - 100})"
      alignment-baseline="middle"
      text-anchor="middle"
      font-size="12"
    >
      <tspan x="0" dy=".6em">{dayjs(activeJob.date).format('DD MMM, YY')}</tspan>
      <tspan x= "0" dy="1.2em">{activeJob.total_endpoints} stable endpoints</tspan>
      <tspan x="0" dy="1.2em">{activeJob.percent_tested}% tested</tspan>
      <tspan x="0" dy="1.2em">{activeJob.percent_conf_tested}% conformance tested</tspan>
    </text>
    {/if}
  </svg>
</div>
<div id="legend">
  <p><span class='tests'></span> Coverage by tests</p>
  <p><span class='conformance'></span>Coverage by conformance tests</p>
</div>

<style>
 .chart {
   max-width: 900px;
   margin-left: auto;
   margin-right: auto;
 }

 svg {
   position: relative;
   width: 100%;
   height: 450px;
   overflow: visible;
 }

 .tick {
   font-size: .725em;
   font-weight: 200;
 }

 .tick line {
   stroke: #aaa;
   stroke-dasharray: 2;
 }

 .tick text {
   fill: #666;
   text-anchor: start;
 }

 .tick.tick-0 line {
   stroke-dasharray: 0;
 }

 .x-axis .tick text {
   text-anchor: middle;
 }

 .releases .release text {
   fill: gray;
   font-style: italic;
 }

 .path-line {
   fill: none;
   stroke: rgb(234,226,108);
   stroke-linejoin: round;
   stroke-linecap: round;
   stroke-width: 1;
 }

 .path-line.conf {
   stroke: rgb( 0, 100, 100);
 }

 .path-area {
   fill: rgba(234, 226, 108, 0.2);
 }

 .path-area.conf {
   fill: rgba(0, 100, 100, 0.2);
 }

 circle.point {
   fill: orange;
   fill-opacity: 0.6;
   stroke: rgba(0,0,0,0.5);
   cursor: pointer;
 }

 circle.point.conf {
   fill: green;
 }

 #legend {
   width: 25%;
   border: 1px solid black;
   padding: 0.25rem;
   font-size: 0.75rem;
   margin-top: 1.25rem;
 }
 #legend p {
   display: flex;
   align-items: center;
   margin: 0;
   padding: 0;
 }
 #legend span {
   display: block;
   width: 2rem;
   height: 0.75rem;
   margin-right: 0.75rem;
 }
 #legend span.tests {
   background: rgba(234, 226, 108, 0.5);
 }

 #legend span.conformance {
   background: rgba(0, 100, 100, 0.5);
 }
</style>
