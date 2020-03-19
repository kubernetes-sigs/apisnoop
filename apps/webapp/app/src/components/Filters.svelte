<script>
 import {
     activeFilters,
     filteredEndpoints
     } from '../stores';
 $: filtersVisible = false;

 function visToggle () {
     filtersVisible = !filtersVisible;
 };
</script>

{#if !filtersVisible}
    <div class='filters off'>
    <button on:click={visToggle}>Set Filters</button>
    </div>
{:else}
    <div class='filters on'>
        <button on:click={visToggle} class='close'>Close Filters</button>
        <h2>Set Filters</h2>
        <label>
            <input type='checkbox' bind:checked={$activeFilters.hide_tested} on:click={() => console.log('af', $activeFilters, $filteredEndpoints.length)}/>
            hide tested
        </label>
    </div>
{/if}


<style>
 div.filters.on {
     position: absolute;
     width: 350px;
     top: 0;
     right: 0;
     min-height: 100vh;
     background: blanchedalmond;
 }

</style>


