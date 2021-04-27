<script>
 import page from 'page';

 const toggleInQuery = () =>
     window.location.search.toLowerCase().includes("conformance-only=true");

 function toggleConformanceFilter ({target}) {
     const path = window.location.pathname;
     if (target.checked) {
         page(`${path}?conformance-only=true`);
     } else {
         page(path);
     }
     console.log({loc: window.location.search, toggleInQuery: toggleInQuery()})
 }

</script>

<div>
    <input type='checkbox'
           checked={toggleInQuery()}
           id='conformance-only-toggle'
           name='conformance-only'
           on:click={toggleConformanceFilter}
    />
<label for='conformance-only'>Only show conformance eligible endpoints</label>
</div>
