<script>
 import { defaultBucketAndJob as metadata} from '../stores';
 import { afterUpdate } from 'svelte';

</script>

<header>
    <h1>{$metadata.bucket}</h1>
    <p>Test Run: {$metadata.job}</p>
    <em>{$metadata.timestamp}</em>
</header>
