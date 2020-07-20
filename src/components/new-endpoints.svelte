<script>
import { newEndpoints } from '../store';
</script>

<ul>
  {#each $newEndpoints as {endpoint, level, category, tested, conf_tested}}
    <li>
      {endpoint}({level}, {category}): {tested}, {conf_tested}
    </li>
  {/each}
</ul>
