<script>
 import Nav from '../components/Nav.svelte';

</script>

<style>
 main {
   position: relative;
   max-width: 1080px;
   margin: auto;
   padding: 2em;
   box-sizing: border-box;
 }
</style>

<Nav />
<main>
  <slot></slot>
</main>
