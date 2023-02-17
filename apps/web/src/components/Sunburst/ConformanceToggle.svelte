<script>
 import page from 'page';

 const conformanceLink = 'https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md#conformance-test-requirements';

 function isFilterInQuery (filter)  {
   const params = (new URL(document.location)).searchParams;
   return params.has(filter);
 }

 function toggleConformanceFilter ({target}) {
   const path = window.location.pathname;
   if (target.checked) {
     page(`${path}?conformance-only=true`);
   } else {
     page(path);
   }
 }

 function toggleFilter ({ target }) {
   const params = (new URL(document.location)).searchParams;
   const path = window.location.pathname;
   if (target.checked) {
     params.set(target.name,true)
     page(`${path}?${params.toString()}`)
   } else {
     params.delete(target.name)
     let paramString = params.toString();
     if (paramString === "") {
       page(`${path}`)
     } else {
       page(`${path}?${paramString}`)
     }
   }
 }

</script>

<form>
  <div class='form-group'>
    <input type='checkbox'
           id='exclude-ineligible-toggle'
           name='exclude-ineligible'
           checked={isFilterInQuery('exclude-ineligible')}
           on:click={toggleFilter} />
    <label for='exclude-ineligible'>
      exclude conformance ineligible endpoints
      (<em><a href='/conformance-progress/ineligible-endpoints'>which ones are removed?</a></em>)
    </label>
  </div>
  <div class='form-group'>
    <input type='checkbox'
           id='exclude-pending-tgogle'
           name='exclude-pending'
           checked={isFilterInQuery('exclude-pending')}
           on:click={toggleFilter} />
    <label for='exclude-pending'>
      exclude endpoints whose eligibility is pending
      <!-- (<em><a href='/conformance-progress/ineligible-endpoints'>which ones are removed?</a></em>) -->
    </label>
  </div>
  <div class='form-group'>
    <input type='checkbox'
           id='conformance-only-toggle'
           name='conformance-only'
           checked={isFilterInQuery('conformance-only')}
           on:click={toggleFilter} />
    <label for='conformance-only'>Only show
      <a href={conformanceLink}
              target="_blank"
         rel='nofollower noreferrer'>
        conformance eligible endpoints
      </a>
    </label>
  </div>
</form>

<style>
 form {
   margin-top: 1rem;
 }
</style>
