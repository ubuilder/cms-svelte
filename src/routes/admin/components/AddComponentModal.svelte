<script lang="ts">
  import { BaseModal, Button, ButtonList, FormInput, ModalBody, ModalFooter, modal } from "@ulibs/yesvelte";


    export let data: any = {};
</script>
<BaseModal>
    <ModalBody>
        <FormInput label="Name" bind:value={data.name}/>
    </ModalBody>
    
    <ModalFooter>
        <ButtonList>
            <Button on:click={() => $modal.close()}>Cancel</Button>
            <Button on:click={() => $modal.resolve(data)} color="primary">Add</Button>
            </ButtonList>
    </ModalFooter>
</BaseModal>