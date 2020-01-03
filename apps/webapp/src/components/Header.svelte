<script>
 import { metadata } from '../stores';
</script>

<header>
    <h1>{$metadata.bucket}</h1>
    <p>Test Run: {$metadata.job}</p>
    <em>{$metadata.timestamp}</em>
</header>
