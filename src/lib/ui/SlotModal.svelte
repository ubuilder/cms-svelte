<script lang="ts">
  import { onMount, tick } from "svelte";
  import {
    ButtonList,
    modal,
    BaseModal,
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
    El,
  } from "@ulibs/yesvelte";

  export let mode: "add" | "edit" = "add";



  export let components: any[] = []
  export let allowedComponents: any[] = [];
  export let disabledComponents: any[] = [];
  let items = components.filter(x => !disabledComponents.includes(x.id));

  export let slot: any = {
    props: {},
    slot: [],
  };

  // let component: any;

  // async function updateType(type: any) {
  //   component = components[type];
  // }

  onMount(() => {
    console.log(slot);
    if (mode === "edit") {
      // updateType(slot.type);
    }
    if (!slot.props) {
      slot.props = {};
    }
  });

  // $: if (slot.type) updateType(slot.type);
</script>

<BaseModal title={"Choose a type"}>
  <!-- {#if mode === "add" && !slot.type} -->
  <ModalBody>
    <El row g="2">
      {#each items as item}
        {#if allowedComponents.length > 0 ? allowedComponents.includes(item.id): true }
            <El col="3">
              <El
                style="cursor: pointer"
                class="component-item {slot.type === item.name ? 'active' : ''}"
                py="3"
                textAlign="center"
                borderRoundSize="2"
                on:dblclick={() => $modal.resolve({ ...slot, type: item.name })}
                on:click={() => (slot.type = item.name)}
              >
                {item.name}
              </El>
            </El>
        {/if}
      {/each}
    </El>
  </ModalBody>
  <!-- {:else} -->

  <!-- {#key slot.type}
      {#if component} 
        <svelte:component this={component} edit bind:props={slot.props} />
      {/if}
    {/key} -->
  <!-- {/if} -->

  <!-- {#if item}
      {#each item.props as prop}
        <FormField style="position: relative" label={prop.name} bind:value={slot.props[prop.name]}>
          <div class="dynamic-icon"></div>
          <Input bind:value={slot.props[prop.name]}/>
        </FormField>
      {/each}
    {/if} -->

  <ModalFooter>
    <ButtonList>
      <Button on:click={() => $modal.close()}>Cancel</Button>
      <Button on:click={() => $modal.resolve(slot)} color="primary">Add</Button>
    </ButtonList>
  </ModalFooter>
</BaseModal>
