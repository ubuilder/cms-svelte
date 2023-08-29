<script lang="ts">
  import Page from "$lib/components/core/Page.svelte";
  import { Form } from "$lib/components/core/form";
  import Filter from "$lib/components/filters/Filter.svelte";
  import FilterList from "$lib/components/filters/FilterList.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import Asset from "./Asset.svelte";
  import { invalidateAll } from "$app/navigation";

  export let data;

  let uploadInput: any;

  async function onSubmit(event: any) {
    console.log(event.target.files);

    const formData = new FormData();

    formData.append("file", event.target.files[0]);

    const result = await fetch("?/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    await invalidateAll();
    console.log(result);
  }

  let filters = {};
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
    <Filter
      type="select"
      key="type"
      items={[
        { text: "Image", key: "image" },
        { text: "Audio", key: "audio" },
        { text: "Video", key: "video" },
      ]}
      text="Type"
    />
    <Filter type="text" key="name" text="Name" />
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