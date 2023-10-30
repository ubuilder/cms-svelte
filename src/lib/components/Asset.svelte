<script lang="ts">
  import { El, Icon, modal, confirmModal } from "@ulibs/yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import { invalidateAll } from "$app/navigation";
  import AssetUpdateModal from "./AssetUpdateModal.svelte";
  import type { AssetType } from "$lib/types/asset";
  import { t } from "$lib/i18n";
	import { createEventDispatcher } from "svelte"

  export let asset: AssetType;
  const dispatch = createEventDispatcher()

  async function onRemove() {
    const choice = await confirmModal.open({
      status: "danger",
      title: t("assets.messages.confirm_remove"),
    });

    if (choice) {
      dispatch('remove')
    }
  }


</script>

<El col="6" colMd="4" colLg="3">
  <El
    border
    borderRoundSize="3"
    style="overflow: hidden"
    on:click={() => dispatch('select', asset)}
    position="relative"
  >
    {#if asset.type === "image"}
      <AssetImage {asset} />

    <!-- {:else if asset.type === "audio"}
      AUDIO
    {:else if asset.type === "video"}
      VIDEO -->
    {:else}
    <El col="6" colMd="4" colLg="3"  border
        
      borderRoundSize="3"
 d="flex" style="flex-direction: column;" bgColor="secondary" bgOpacity="10" p="3">
        <Icon mx="auto" mb="3" size="3x" name="file"/>
        <El>
          {asset.name}

        </El>
      </El>
      
    {/if}
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
  </El>
</El>
