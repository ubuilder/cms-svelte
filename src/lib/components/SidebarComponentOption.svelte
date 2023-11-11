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
    <SidebarTitleButton icon="settings" on:click={() => openComponentSettings()} />
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
                  <El px="3" py="2" borderRoundSize="2" border on:click={() => selectSlot(slot.id)}>
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
          <El row>
            <El col>
              <FormInput label="Class" bind:value={activeSlot.props.Class} />
            </El>
          </El>
        </TabPanel>
        {/if}
      </TabContent>
    </Tabs>
  </div>
{/if}
