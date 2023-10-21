<script>
	import { t } from "$lib/i18n"


  import { Button, FormInput, ModalBody, ModalFooter, ButtonList, modal, BaseModal } from "@ulibs/yesvelte";

  export let page = {};

</script>
<BaseModal title="Add Page">
    <ModalBody>
        <FormInput bind:value={page.title} label="{t('pages.forms.title')}" />
        <FormInput bind:value={page.slug} label={t("pages.forms.slug")} />

    </ModalBody>

    <ModalFooter>
        <ButtonList>
            <Button on:click={() => $modal.close()}>{t('buttons.cancel')}</Button>
            <Button on:click={() => $modal.resolve(page)} color="primary">{t('buttons.add')}</Button>
            </ButtonList>
    </ModalFooter>

</BaseModal>