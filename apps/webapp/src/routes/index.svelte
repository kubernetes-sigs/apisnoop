<script context="module">
 export function preload({ params, query }) {
	 return this.fetch(`index.json`).then(r => r.json()).then(buckets => {
		 return { buckets };
	 });
 }
</script>

<script>
 export let buckets;
 import {
   stableEndpointStats
   } from '../stores';
</script>

<style>
 ul {
	 margin: 0 0 1em 0;
	 line-height: 1.5;
 }
 section#stats {
   height: 100vh;
 }
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Recent buckets</h1>

<ul>
	{#each buckets as bucket}
	<li>{bucket.date}: {bucket.job}</li>
	{/each}
  <a href="#stats">go to stats</a>
</ul>

<section id='stats'>
  <ul>
  {#each buckets as stat}
  <li>{stat.date}: {stat.percent_conf_tested}% conformance tested</li>
  {/each}
  </ul>
</section>


