<script lang="ts">
  import { onMount } from "svelte";

  export let data;

  onMount(() => {
    if (data.app) {
      window.onmessage = (e) => {
        if (e.data.type === "init") {
          e.source?.postMessage(
            { type: "init", token: data.token },
            {
              targetOrigin: data.app!.url,
            }
          );
        }
      };
    }
  });
</script>

<div style="position: relative; width: 100%; height: calc(100% - 7px);">
  {#if data.app}
  <div style="position: absolute; padding: 2rem;">
    Please start "{data.app.name}" app in "{data.app.url}" (repo: {data.app
      .repo})
  </div>

  {#if !data.fail}
    <iframe
      style="position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 300"
      title={data.app.name}
      src={data.app.url}
    />
    {/if}
  {:else}
  App not found
  <!--  -->
  {/if}
</div>
