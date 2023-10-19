<script lang="ts">
  import { El, Icon, modal, confirmModal } from "@ulibs/yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import { invalidateAll } from "$app/navigation";
  import AssetUpdateModal from "./AssetUpdateModal.svelte";
  import type { AssetType } from "$lib/types/asset";
  import { t } from "$lib/i18n";

  export let asset: AssetType;

  async function onRemove() {
    const choice = await confirmModal.open({
      status: "danger",
      title: t("assets.messages.confirm_remove"),
    });

    if (choice) {
      await fetch("?/remove", {
        method: "POST",
        body: JSON.stringify({ id: asset.id }),
      }).then((res) => res.json());

      await invalidateAll();
    }
  }

  async function onPreview() {
    const choice = await modal.open(
      AssetUpdateModal,
      {
        asset,
      },
      { size: "lg" }
    );

    if (choice) {
      await fetch("?/update", {
        method: "POST",
        body: JSON.stringify({
          id: asset.id,
          data: asset,
        }),
      }).then((res) => res.json());
      await invalidateAll();
    }
  }
</script>

<El col="6" colMd="4" colLg="3">
  <El
    border
    borderRoundSize="3"
    style="overflow: hidden"
    on:click={() => onPreview()}
    position="relative"
  >
    {#if asset.type === "image"}
      <AssetImage {asset} />

      <El
        h="50"
        d="flex"
        alignItems="end"
        textColor="light"
        justifyContent="between"
        style="background: linear-gradient(0deg, black, transparent);"
        p="2"
        position="absolute"
        bottom="0"
        start="0"
        end="0"
      >
        <El tag="strong" style="overflow: hidden">{asset.name}</El>
        <Icon on:click!stopPropagation={() => onRemove()} name="trash" />
      </El>
    {:else if asset.type === "audio"}
      AUDIO
    {:else if asset.type === "video"}
      VIDEO
    {:else}
      PREVIEW NOT SUPPORTED
    {/if}
  </El>
</El>
