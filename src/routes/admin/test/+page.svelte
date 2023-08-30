<script>
  import { goto } from '$app/navigation';

    export let data;
</script>
<div>Test Data</div>


<button on:click={() => goto(`?item=${+data.item + 1}`)}></button>
{data.item}