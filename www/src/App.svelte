<script>
  import ApolloClient from 'apollo-boost';  
  import { setClient } from 'svelte-apollo';
  import Stats from './components/stats.svelte';

	export let name;

  const client = new ApolloClient({ uri: 'http://127.0.0.1:4040/v1/graphql' });
  setClient(client);
</script>

<style>
	h1 {
		color: indigo;
	}
</style>

<h1>apisnoop</h1>
<Stats />


