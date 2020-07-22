<script>
 export let title;
</script>

<header>
  {#if title}<h2>{title}</h2>{/if}
  <slot></slot>
</header>

<style>
 h2 {
   font-size: 1.66rem;
   font-weight: 300;
   margin: 0;
   padding: 0;
 }
</style>
