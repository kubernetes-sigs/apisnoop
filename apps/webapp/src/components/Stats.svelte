<script>
 export let stats;

 $: totalEndpoints = stats.total_endpoints;
 $: testHits = stats.test_hits;
 $: confHits = stats.conf_hits;
</script>

<h2>Stats</h2>
<ul>
    <li>{totalEndpoints} total endpoints</li>
    <li>{testHits} test hits</li>
    <li>{confHits} conformance test hits</li>
</ul>
