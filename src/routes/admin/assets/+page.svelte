<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, El, Icon } from "yesvelte";
  import Asset from "./Asset.svelte";
  import { invalidateAll } from "$app/navigation";
  import TextFilter from "$lib/components/filters/TextFilter.svelte";
  import SelectFilter from "$lib/components/filters/SelectFilter.svelte";

  export let data;

  let uploadInput: any;

  async function onSubmit(event: any) {

    const formData = new FormData();

    formData.append("file", event.target.files[0]);

    const result = await fetch("?/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    await invalidateAll();
    console.log(result);
  }
</script>

<Page title="Assets">
  <Button
    on:click={() => uploadInput.click()}
    color="primary"
    slot="header-buttons"
  >
    <Icon name="upload" />
    Upload
  </Button>

  <FilterList>
    <SelectFilter
      key="type"
      items={[
        { text: "Image", key: "image" },
        { text: "Audio", key: "audio" },
        { text: "Video", key: "video" },
      ]}
      text="Type"
    />
    <TextFilter key="name" text="Name" />
  </FilterList>

  <!-- Upload file form -->
  <El d="none">
    <input
      name="file"
      type="file"
      bind:this={uploadInput}
      on:change={onSubmit}
    />
  </El>

  <El row>
    {#each data.assets as asset}
      {#if asset.type === "image"}
        <Asset {asset} />
      {:else}
        {JSON.stringify(asset)}
        <br />
      {/if}
    {/each}
  </El>
</Page>
