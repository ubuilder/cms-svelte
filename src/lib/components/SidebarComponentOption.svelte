<script lang="ts">
  import ComponentProp from '$lib/ui/ComponentProp.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import {
    El,
    FormField,
    FormInput,
    Icon,
    Label,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from 'yesvelte'
  import SidebarTitleButton from './SidebarTitleButton.svelte'
  import { template } from 'handlebars'
  import StyleEditor from './StyleEditor.svelte'

  export let components: any[] = []
  export let activeSlot: any
  const dispatch = createEventDispatcher()

  function selectSlot(slot: any) {
    dispatch('select-slot', slot)
  }

  function openComponentSettings() {
    dispatch('open-component-settings', getComponent(activeSlot.type))
  }

  $: {
    dispatch('update', activeSlot)
  }

  $: hasClass = getComponent(activeSlot?.type)?.template?.includes("Class");
  const getComponent = (id) => components.find((x) => x.id === id)
</script>

{#if activeSlot}
  <div class="sidebar-title">
    {getComponent(activeSlot.type)?.name ?? activeSlot.id} options
    <div class="ms-auto flex gap-2">

    <SidebarTitleButton icon="arrow-up" on:click={() => dispatch('select-parent')} />

    {#if !getComponent(activeSlot.type).global}
      <SidebarTitleButton icon="settings" color="secondary" on:click={() => openComponentSettings()} />
    {/if}
    </div>

  </div>
  <div class="sidebar-body">

    <Tabs>
      <TabList>
        <TabItem>Props</TabItem>
        {#if hasClass}
          <TabItem>Style</TabItem>
        {/if}
      </TabList>
      <TabContent>
        <TabPanel p="2">
          {#each getComponent(activeSlot.type)?.fields ?? [] as field}
            {#if field.type !== 'slot'}
              <ComponentProp
                {components}
                items={{}}
                {field}
                bind:value={activeSlot.props[field.name]} />
            {:else}
              <FormField label={field.name} mb="2">
                {#each activeSlot.props[field.name] ?? [] as slot}
                  <El class="slot-item" px="3" py="2" borderRoundSize="2" border on:click={() => selectSlot(slot.id)}>
                    {getComponent(slot.type)?.name}
                  </El>
                {/each}
              </FormField>
            {/if}
          {/each}

          <El row>
            <El col></El>
          </El>
        </TabPanel>
        {#if hasClass}

        <TabPanel p="2">
          
          <StyleEditor bind:value={activeSlot.props.Class}/>
        </TabPanel>
        {/if}
      </TabContent>
    </Tabs>
  </div>
{/if}


<style>
  :global(.slot-item) {
    background-color: #ffffff30;
    margin-top: 4px;
    
    box-shadow: 0 2px 4px -2px #20202020;
  }
  :global(.slot-item):hover {
    background-color: #ffffff50;
    box-shadow: 0 2px 4px -2px 202020a0;
  }
</style>