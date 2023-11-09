<script lang="ts">
  import { Button, El, modal, ButtonList, BaseModal, FormInput } from "@ulibs/yesvelte";
  import AssetImage from "./AssetTypes/AssetImage.svelte";
  import type { AssetType } from "$lib/types/asset";
  import { t } from "$lib/i18n";

  export let asset: AssetType;
</script>

<form on:submit|stopPropagation={() => $modal.resolve(asset)}>
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
        <FormInput
          col="12"
          label={t('assets.forms.name')}
          bind:value={asset.name}
          name="name"
        />
        <FormInput
          col="12"
          label={t("assets.forms.description")}
          bind:value={asset.description}
          name="description"
        />
        <FormInput
          col="12"
          label={t('assets.forms.alt')}

          bind:value={asset.alt}
          name="alt"
        />
    </El>
  </El>

  <ButtonList slot="footer" justifyContent="end">
    <Button on:click={() => $modal.close()}>{t('buttons.cancel')}</Button>
    <Button  type="submit"  color="primary">
      {t("buttons.update")}
    </Button>
  </ButtonList>
</BaseModal>
</form>
