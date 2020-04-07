<script>
 export let title;
</script>

<header>
  <h2>{title}</h2>
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
