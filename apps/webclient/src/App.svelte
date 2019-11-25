<script>
  import ApolloClient from 'apollo-boost';  
  import { setClient } from 'svelte-apollo';
  import Stats from './components/stats.svelte';

  const client = new ApolloClient({ uri: 'http://147.75.84.193:8080/v1/graphql' });
  setClient(client);
</script>

<style>
	h1 {
		color: indigo;
	}
</style>

<h1>apisnoop</h1>
<Stats />


