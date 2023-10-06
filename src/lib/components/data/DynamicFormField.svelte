<script lang="ts">
  import { nanoid } from "nanoid";
  import {
  Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    FormEditor,
    FormField,
    FormInput,
    Label,
    Popover,
    FormSelect,
  } from "yesvelte";
  import FilePicker from "./FilePicker.svelte";

  const id = "form-field-" + nanoid();

  function onAdd(key: string) {
    if(type === 'image') {
        localValue = '{{' + key + '}}'
    } else {
        localValue = localValue + '{{' + key + '}}'
    }
  }

  export let items: any[] = [];
  export let type: string = "plain_text";

  export let label: string | undefined = undefined;
  export let required: boolean = false;
  export let value: any;

  let localValue = value ?? '';

  $: value = localValue;
</script>

<FormField {...$$restProps}>
  <Label d="flex" gap="2" for={id} {required} slot="label">
    <span>{label}</span>
    {#if items.length > 0}
    <Dropdown arrow={false} placement="right-start">
        <div slot="target" tabindex="0" class="dynamic-icon" />
        <DropdownMenu>
            {#each items as item}
            <DropdownItem on:click={() => onAdd(item.key)}>
              {item.text}
            </DropdownItem>
          {/each}
        </DropdownMenu>
    </Dropdown>
    {/if}
  </Label>
  {value}
  {#if type === "plain_text"}
    <FormInput {...$$restProps} bind:value={localValue} />

  {:else if type === "rich_text"}
    <FormEditor {...$$restProps} bind:value={localValue} />
  {:else if type === 'select'}
    <FormSelect {...$$restProps} bind:value={localValue} let:item>
        {item}
    </FormSelect>
    {:else if type === 'image'}
    <FilePicker {...$$restProps} bind:value={localValue} type="image"/>
  {/if}
  
  <slot />
</FormField>

<style>
  .dynamic-icon {
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    /* position: absolute; */
    top: 22px;
    background: #57bfffc2;
    border-radius: 50%;
    left: -7px;
    width: 20px;
    height: 20px;
  }

  .dynamic-icon::before {
    content: "+";
    color: white;
    margin-bottom: 1px;
  }
  .dynamic-icon:hover {
    /* top: 17px; */
    background: #1da1f2;
    /* left: -12px;
      width: 25px;
      height: 25px; */
  }
  .dynamic-icon:hover::before {
    font-size: 20px;
    /* margin-bottom: 5px; */
  }
</style>
