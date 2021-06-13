<script>
 import page from 'page';

 const conformanceLink = 'https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md#conformance-test-requirements';

 const isToggleInQuery = () =>
     window.location.search.toLowerCase().includes("conformance-only=true");

 function toggleConformanceFilter ({target}) {
     console.log({target})
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
           checked={isToggleInQuery()}
                 id='conformance-only-toggle'
           name='conformance-only'
           on:click={toggleConformanceFilter}
    />
    <label for='conformance-only'>Only show
        <a href={conformanceLink}
           target="_blank"
           rel='nofollower noreferrer'>
            conformance eligible endpoints
        </a>
    </label>
        <p>(<em><a href='/conformance-progress/ineligible-endpoints'>which ones are removed?</a></em>)</p>
</div>
