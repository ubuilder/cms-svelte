<script lang="ts">
  import { t } from "$lib/i18n";
  import { BaseModal, Button, ButtonList, FormInput, ModalBody, ModalFooter, modal } from "@ulibs/yesvelte";


    export let data: any = {};
</script>
<BaseModal>
    <form method="POST" action="/" on:submit|preventDefault={() => $modal.resolve(data)}>
        <ModalBody>
            <FormInput label={t("components.forms.name")} bind:value={data.name}/>
        
    </ModalBody>
    
    <ModalFooter>
        <ButtonList>
            <Button on:click={() => $modal.close()}>{t("buttons.cancel")}</Button>
            <Button type="submit" color="primary">{t("buttons.add")}</Button>
            </ButtonList>
    </ModalFooter>
</form> 

</BaseModal>