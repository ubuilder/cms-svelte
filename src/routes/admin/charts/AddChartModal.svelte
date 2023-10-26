<script lang="ts">
    import { t } from "$lib/i18n";
    import { BaseModal, Button, ButtonList, FormInput, ModalBody, ModalFooter, modal } from "@ulibs/yesvelte";
  
  
      export let data: any = {};
  </script>
  <BaseModal>
      <ModalBody>
          <FormInput label={t("charts.forms.name")} placeholder={t('charts.forms.name_placeholder')} bind:value={data.name}/>
      </ModalBody>
      
      <ModalFooter>
          <ButtonList>
              <Button on:click={() => $modal.close()}>{t("buttons.cancel")}</Button>
              <Button on:click={() => $modal.resolve(data)} color="primary">{t("buttons.add")}</Button>
              </ButtonList>
      </ModalFooter>
  </BaseModal>