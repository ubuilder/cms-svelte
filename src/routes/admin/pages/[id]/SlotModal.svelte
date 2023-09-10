<script lang="ts">
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import { modal } from "$lib/components/core/modal";
  import Modal from "$lib/components/core/modal/Modal.svelte";
  import { tick } from "svelte";
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

  let items = [
    {
      hasSlot: false,
      name: "Button",
      props: [
        { name: "text", type: "string" },
        { name: "color", type: "string" },
      ],
    },
    {
      name: "Container",
      hasSlot: true,
      props: [{ name: "size", type: "string" }],
    },
    {
      name: "Input",
      hasSlot: false,
      props: [{ name: "value", type: "string" }],
    },
    {
      name: "HtmlText",
      hasSlot: false,
      props: [{ name: "text", type: "string" }],
    },
  ];

  let slot: any = {
    props: {},
    slot: [],
  };

  $: item = items.find((x) => x.name === slot.type);
</script>

<Modal>
  <ModalBody>
    <FormSelect {items} label="Type" key="name" bind:value={slot.type} let:item>
      {item.name}
    </FormSelect>

    {#if item}
      {#each item.props as prop}
        <FormField style="position: relative" label={prop.name} bind:value={slot.props[prop.name]}>
          <div class="dynamic-icon"></div>
          <Input bind:value={slot.props[prop.name]}/>
        </FormField>
      {/each}
    {/if}
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