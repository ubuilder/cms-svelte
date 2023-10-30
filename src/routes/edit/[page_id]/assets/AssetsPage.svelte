<script lang="ts">
  import { Page, FilterList, TextFilter, SelectFilter, Button, El, Icon, modal } from "@ulibs/yesvelte";
  import Asset from "$lib/components/Asset.svelte";
  import { invalidateAll } from "$app/navigation";
  import { t } from "$lib/i18n";
	import type { AssetType } from "$lib/types/asset"
	import { createEventDispatcher } from "svelte"
	import AssetUpdateModal from "$lib/components/AssetUpdateModal.svelte"

  export let assets: AssetType[] = [];

  let uploadInput: any;

  const dispatch = createEventDispatcher()


  async function onSubmit(event: any) {

    const formData = new FormData();

    formData.append("file", event.target.files[0]);
  
    dispatch('upload', formData)

  }

  async function onPreview({detail}: CustomEvent) {
    const choice = await modal.open(
      AssetUpdateModal,
      {
        asset: detail,
      },
      { size: "lg" }
    );

    if (choice) {
      dispatch('update', detail)

    }
  }
</script>

<Page>
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
    {#each assets as asset}
      <Asset on:remove on:select={onPreview} {asset} />
    {/each}
  </El>
</Page>
