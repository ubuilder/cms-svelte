<script lang="ts">
  import { El, Icon } from "yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import { modal } from "$lib/components/core/modal";
  import ConfirmModal from "$lib/components/core/modal/ConfirmModal.svelte";
  import { invalidateAll } from "$app/navigation";
  import AssetUpdateModal from "./AssetUpdateModal.svelte";

  export let asset: any;

  async function onRemove() {
    const choice = await modal.open(ConfirmModal, {
      status: "danger",
      title: "Are you sure to remove this Asset?",
    });

    console.log(choice);

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
        <El tag="strong">{asset.name}</El>
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
