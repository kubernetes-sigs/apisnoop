<script>
 import page from 'page';

 function toggleConformanceFilter ({target}) {
     const path = window.location.pathname;
     if (target.checked) {
         page(`${path}?conformance-only=true`);
     } else {
         page(path);
     }
 }

</script>

<div>
    <input type='checkbox'
           id='conformance-only-toggle'
           name='conformance-only'
           on:click={toggleConformanceFilter}
    />
<label for='conformance-only'>Only show conformance eligible endpoints</label>
</div>
