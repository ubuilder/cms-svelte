<script>
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
    import Modal from "$lib/components/core/modal/Modal.svelte";
  import { Button, FormInput, ModalBody, ModalFooter } from "yesvelte";
  export let page = {};

</script>
<Modal title="Add Page">
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

</Modal>