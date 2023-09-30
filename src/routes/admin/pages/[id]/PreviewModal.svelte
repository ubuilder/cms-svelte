<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { Button, Icon, ModalHeader, ModalTitle } from "yesvelte";

    export let slug: any[] =[];
    export let title: string | undefined = undefined;

</script>

<Modal>
    <ModalHeader px='3'>
        <ModalTitle>{title}</ModalTitle>
        <ButtonList>

        <Button target="_blank" href="/{slug}"><Icon name="external-link"/>
            Open in new Tab</Button>
        <Button on:click={() => $modal.close()}>Close</Button>
    </ButtonList>

    </ModalHeader>
    <iframe title={title} src="/{slug}" frameborder="0"></iframe>

</Modal>