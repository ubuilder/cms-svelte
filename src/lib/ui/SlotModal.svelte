<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { onMount, tick } from "svelte";
  import {
    FormInput,
    Button,
    FormSelect,
    ModalBody,
    ModalFooter,
    Tabs,
    TabItem,
    TabList,
    TabContent,
    TabPanel,
    Input,
    FormField,
  } from "yesvelte";

  export let mode: 'add' | 'edit' = 'add' 

  let items = [
    "Button",
     "Container",
    "Input",
     "HtmlText",
    "Form"
  ];

  export let slot: any = {
    props: {},
    slot: [],
  };

  let component: any;

  async function updateType(type: string) {
    const module = await import(`./components/${type}.svelte`);

    const data = module.data;

    component = module.default;

  }

  onMount(() => {
    console.log(slot)
    if(mode==='edit') {
      updateType(slot.type)
    }
  })

  $: if(slot.type) updateType(slot.type)
</script>

<Modal>
  <ModalBody>
    {#if mode === 'add'}
      <FormSelect {items} label="Type" bind:value={slot.type} let:item>
        {item}
      </FormSelect>
    {/if}

    <div>
      {#if component}
        <svelte:component this={component} edit={true} bind:props={slot.props}/>
      {/if}
    </div>

    <!-- {#if item}
      {#each item.props as prop}
        <FormField style="position: relative" label={prop.name} bind:value={slot.props[prop.name]}>
          <div class="dynamic-icon"></div>
          <Input bind:value={slot.props[prop.name]}/>
        </FormField>
      {/each}
    {/if} -->
  </ModalBody>

  <ModalFooter>
    <ButtonList>
      <Button on:click={() => $modal.close()}>Cancel</Button>
      <Button on:click={() => $modal.resolve(JSON.parse(JSON.stringify(slot)))} color="primary">Add</Button>
    </ButtonList>
  </ModalFooter>
</Modal>

<style>
  .dynamic-icon {
    z-index: 10;transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position:absolute;top: 22px;background: #57bfffc2;border-radius: 50%;left: -7px;width: 15px;height: 15px;
  }

  .dynamic-icon::before {
    content: '+';
    color: white;
    margin-bottom: 1px;
  }
  .dynamic-icon:hover {
    top: 17px;background: #1da1f2;left: -12px;width: 25px;height: 25px;
  }
  .dynamic-icon:hover::before {
    font-size: 20px;
    margin-bottom: 5px;
  }
</style>