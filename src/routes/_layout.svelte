<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
    font-size: 16px;
		background-color: white;
		padding: 2em;
		box-sizing: border-box;
    max-width: 1100px;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>

