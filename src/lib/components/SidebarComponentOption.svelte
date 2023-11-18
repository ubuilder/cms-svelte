<script lang="ts">

  import ComponentProp from '$lib/ui/ComponentProp.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import {
  Accordion,
    AccordionBody,
    AccordionHeader,
    Accordions,
  Button,
  Card,
    El,
    FormCheckbox,
    FormField,
    FormInput,
    FormSelect,
    Icon,
    Label,
    Switch,
    TabContent,
    TabItem,
    TabList,
    TabPanel,
    Tabs,
  } from 'yesvelte'
  import SidebarTitleButton from './SidebarTitleButton.svelte'
  import { template } from 'handlebars'
  import StyleEditor from './StyleEditor.svelte'
  import FormFields from './content/FormFields.svelte'
  import DynamicFormField from './content/DynamicFormField.svelte'
  import type { Field } from '$lib/types'
  import EventsEditor from './EventsEditor.svelte'
  import { getId } from '$lib/helpers'

  export let tables: any[] = []
  export let components: any[] = []
  export let activeSlot: any
  export let responsiveMode = '@xl:'

  export let items: any = {}

  
  const dispatch = createEventDispatcher()

  function selectSlot(slot: any) {
    dispatch('select-slot', slot)
  }

  function switchDynamic(field: string) {
    if(activeSlot.props[field].name) {
      activeSlot.props[field].name = null;
    } else {
      activeSlot.props[field].name = getId();
      activeSlot.props[field].multiple = true;

    }
  }

  function openComponentSettings() {
    dispatch('open-component-settings', getComponent(activeSlot.type))
  }

  function getFilterType(type: Field['type']) {
    if(type === 'date_time') {
      return {
        operator: 'between',
        type: 'date_range'
      }
    }
    // if(type === 'date_time') => range picker

    // 

    // if(type === 'plain_text')
    if(type === 'rich_text') {
      return {
        operator: 'like',
        type: 'plain_text'
      }
    }

    return {
      operator: '=',
      type: type
    }
  }

  $: {
    dispatch('update', activeSlot)
  }

  $: hasClass = getComponent(activeSlot?.type)?.template?.includes("Class");
  $: hasAttributes = getComponent(activeSlot?.type)?.template?.includes("Attributes");

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
        {#if hasAttributes}
          <TabItem>Events</TabItem>
        {/if}
      </TabList>
      <TabContent>
        <TabPanel p="2">
          {#each getComponent(activeSlot.type)?.fields ?? [] as field}
            {#if field.type !== 'slot'}
              <ComponentProp
                {components}
                {items}
                {field}
                bind:value={activeSlot.props[field.name]} />
            {:else}

            {#if activeSlot.props[field.name]}
              <FormField mb="2">
                <div class="flex items-center justify-between">
                  <Label>{field.name}</Label>
                  <Switch checked={activeSlot.props[field.name].name} on:change={() => switchDynamic(field.name)}/>
                </div>

                {#if activeSlot.props[field.name]?.name}
                  {@const table = tables.find((x) => x.id === activeSlot.props[field.name].table)}

                  <Accordions>
                  <Accordion>
                    <AccordionHeader class="page-slot" p=0>
                      <El px="3" py="2">
                        {table?.name ?? '---'}
                      </El>
                    </AccordionHeader>
                    <AccordionBody style="background-color: var(--y-bg-surface)" p="0">
                      <El p=2>
                        <FormInput label="Name (as)" bind:value={activeSlot.props[field.name].name}/>

                      <FormSelect bind:value={activeSlot.props[field.name].table} placeholder="Choose table" items={tables} label="Table" key="id" let:item>
                        {item.name}
                      </FormSelect>
                      <FormCheckbox label="Multiple" bind:checked={activeSlot.props[field.name].multiple} />
                      <FormField label="Filters">
                        <Accordions>
                          {#each activeSlot.props[field.name].filters ?? [] as filter}
                          {@const field_ = table.fields.find(x => x.name === filter.field)}

                          <Accordion>
                            <AccordionHeader p=0>
                              <El ps=3 w="100" d="flex" justifyContent="between" alignItems="center">
                                <div>{filter.field ?? "---" }</div>
                                <Button
                                  color="danger"
                                  ghost
                                  on:click!stopPropagation={() =>
                                    (activeSlot.props[field.name].filters = activeSlot.props[field.name].filters.filter(
                                      (x) => x !== filter
                                    ))}>
                                    <Icon name="trash" />
                                    </Button>
                              </El>
                            </AccordionHeader>
                            <AccordionBody  style="background-color: var(--y-bg-surface)" p="0">
                              {#if table}
                              <El p="2" row>
                                <FormSelect
                                  col="12"
                                  label="Field"
                                  items={table.fields}
                                  placeholder="Choose Field..."
                                  key="name"
                                  bind:value={filter.field}
                                  let:item
                                >
                                  <Icon name="user" />
              
                                  {item.name}
                                </FormSelect>
                                <FormSelect
                                  col="12"
                                  label="Operator"
                                  items={["=", "!=", "like", 'between', 'in']}
                                  bind:value={filter.operator}
                                  let:item
                                >
                                {item}
                              </FormSelect>
                                {#if field_}
                                {@const filterType = getFilterType(field_.type)}
              
                                
                                  {#if filterType.type !== 'date_range'}
              
                                    <DynamicFormField col label="value" options={field.options} {items} type={filterType.type} bind:value={filter.value}/>
                                  {:else}
                                    <DynamicFormField col label="from" {items} type='date_time' bind:value={filter.from}/>
                                    <DynamicFormField col="6" label="to" {items} type='date_time' bind:value={filter.to}/>
                                  {/if}
                                {/if}
                                <!-- <FormInput col label="Value" bind:value={filter.value} /> -->
                                
                              </El>
                            {/if}
                            </AccordionBody>
                          </Accordion>
                        {/each}

                        </Accordions>
                        <Button
                        size="sm"
                        mt="3"
                          color="primary"
                          on:click={() => (activeSlot.props[field.name].filters = [...(activeSlot.props[field.name].filters??[]), {field: undefined, operator: '=', value: ''}])}
                        >
                          <Icon name="plus" />
                          Add New Filter
                        </Button>
                      </FormField>
                      <FormField label="Pagination...">
                        <El row>
                          <FormInput col="6" bind:value={activeSlot.props[field.name].page} label="Page" type="number"/>
                          <FormInput col="6" bind:value={activeSlot.props[field.name].perPage} label="Per Page" type="number"/>
                        </El>
                      </FormField>
                    </El>

                    </AccordionBody>
                  </Accordion>
                </Accordions>
                {/if}
                {#each activeSlot.props[field.name]?.slot ?? [] as slot}
                  <El class="slot-item" px="3" py="2" borderRoundSize="2" border on:click={() => selectSlot(slot.id)}>
                    {getComponent(slot.type)?.name}
                  </El>
                {/each}
              </FormField>
            {/if}
            {/if}
          {/each}
        </TabPanel>
        {#if hasClass}
          <TabPanel p="2">
            <StyleEditor bind:responsiveMode bind:value={activeSlot.props.Class}/>
          </TabPanel>
        {/if}
        {#if hasAttributes}
          <TabPanel p="2">
            <EventsEditor  bind:value={activeSlot.props.Attributes}/>
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