<script>

  import { Button, FormInput, ModalBody, ModalFooter, ButtonList, modal, BaseModal } from "@ulibs/yesvelte";

  export let page = {};

</script>
<BaseModal title="Add Page">
    <ModalBody>
        <FormInput bind:value={page.title} label="Page Title" />
        <FormInput bind:value={page.slug} label="Slug" />

    </ModalBody>

    <ModalFooter>
        <ButtonList>
            <Button on:click={() => $modal.close()}>Cancel</Button>
            <Button on:click={() => $modal.resolve(page)} color="primary">Add</Button>
            </ButtonList>
    </ModalFooter>

</BaseModal>