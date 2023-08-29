<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { Button, El } from "yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import { Form } from "$lib/components/core/form";

  export let asset: any;
</script>

<Modal>
  <El slot="body" row>
    <El col="12" colSm="8">
      {#if asset.type === "image"}
        <AssetImage {asset} />
      {:else}
        OTHER
      {/if}
    </El>
    <El col="12" colSm="4">
      <Form bind:value={asset} action="?/update">
        <Form.Input
          col="12"
          colMd="12"
          colSm="12"
          colLg="12"
          colXl="12"
          label="Name"
          name="name"
        />
        <Form.Input
          col="12"
          colMd="12"
          colSm="12"
          colLg="12"
          colXl="12"
          label="Description"
          name="description"
        />
        <Form.Input
          col="12"
          colMd="12"
          colSm="12"
          colLg="12"
          colXl="12"
          label="Alt text"
          name="alt"
        />
      </Form>
    </El>
  </El>

  <ButtonList slot="footer" justifyContent="end">
    <Button on:click={() => $modal.close()}>Cancel</Button>

    <Button on:click={() => $modal.resolve(true)} color="primary">
      Update
    </Button>
  </ButtonList>
</Modal>
