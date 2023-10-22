<script lang="ts">
  import { Page, FilterList, TextFilter, SelectFilter, Button, El, Icon } from "@ulibs/yesvelte";
  import Asset from "./Asset.svelte";
  import { invalidateAll } from "$app/navigation";
  import { t } from "$lib/i18n";

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

<Page title={t('assets.title')}>
  <Button
    on:click={() => uploadInput.click()}
    color="primary"
    slot="header-buttons"
  >
    <Icon name="upload" />
    {t('assets.upload')}
  </Button>

  <FilterList>
    <SelectFilter
      key="type"
      items={[
        { text: t("assets.image"), key: "image" },
        { text: t("assets.audio"), key: "audio" },
        { text: t("assets.video"), key: "video" },
      ]}
      text="Type"
    />
    <TextFilter key="name" text={t('assets.filters.name')} />
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
