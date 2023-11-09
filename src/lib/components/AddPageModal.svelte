<script>
	import { t } from "$lib/i18n"


  import { Button, FormInput, ModalBody, ModalFooter, ButtonList, modal, BaseModal } from "@ulibs/yesvelte";

  export let page = {};

</script>
<BaseModal title="Add Page">
    <form method="POST" action="/" on:submit|preventDefault={() => $modal.resolve(page)}>
        <ModalBody>
            <FormInput bind:value={page.title} label="{t('pages.forms.title')}" />
            <FormInput bind:value={page.slug} label={t("pages.forms.slug")} />

    </ModalBody>

    <ModalFooter>
        <ButtonList>
            <Button on:click={() => $modal.close()}>{t('buttons.cancel')}</Button>
            <Button type="submit" color="primary">{t('buttons.add')}</Button>
            </ButtonList>
    </ModalFooter>
</form>

</BaseModal>