<script lang="ts">
  import { Button, El, modal, ButtonList, BaseModal, FormInput } from "@ulibs/yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import type { AssetType } from "$lib/types/asset";

  export let asset: AssetType;
</script>

<BaseModal>
  <El slot="body" row>
    <El col="12" colSm="8">
      {#if asset.type === "image"}
        <AssetImage {asset} />
      {:else}
        OTHER
      {/if}
    </El>
    <El col="12" colSm="4">
      <form action="?/update">
        <FormInput
          col="12"
          label="Name"
          bind:value={asset.name}
          name="name"
        />
        <FormInput
          col="12"
          label="Description"
          bind:value={asset.description}
          name="description"
        />
        <FormInput
          col="12"
          label="Alt text"

          bind:value={asset.alt}
          name="alt"
        />
      </form>
    </El>
  </El>

  <ButtonList slot="footer" justifyContent="end">
    <Button on:click={() => $modal.close()}>Cancel</Button>

    <Button on:click={() => $modal.resolve(true)} color="primary">
      Update
    </Button>
  </ButtonList>
</BaseModal>
