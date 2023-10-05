<script lang="ts">
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    FormAutocomplete,
    FormDatePicker,
    FormEditor,
    FormField,
    FormInput,
    FormSelect,
    FormSwitch,
    FormTextarea,
    Popover,
    PopoverBody,
  } from "yesvelte";
  import FilePicker from "./FilePicker.svelte";
  import FormDataSelect from "./FormDataSelect.svelte";
  import type { Field } from "$lib/types";

  export let field: Field;
  export let data: any = {};

  export let items: any[] = [];

  $: fieldProps = {
    required: field.required,
    label: field.name,
  };
  $: props = {
    required: field.required,
    placeholder: field.placeholder,
  };
</script>

<FormField position="relative" {...fieldProps}>
  {#if items.length > 0}
    <div tabindex="0" class="dynamic-icon" />
    <Popover trigger="focus">
      <El class="y-dropdown-menu">
        {#each items as item}
          <DropdownItem on:click={() => console.log("add ", item.key)}>
            {item.text}
          </DropdownItem>
        {/each}
      </El>
    </Popover>
  {/if}
  <El row>
    {#if field.type === "plain_text"}
      {#if field.input_type === "textarea"}
        <FormTextarea rows="10" {...props} bind:value={data[field.name]} />
      {:else}
        <FormInput
          {...props}
          minlength={field.minlength}
          maxlength={field.maxlength}
          bind:value={data[field.name]}
        />
      {/if}
    {:else if field.type === "rich_text"}
      <FormEditor {...props} bind:value={data[field.name]} />
    {:else if field.type === "number"}
      <FormInput
        {...props}
        type="number"
        min={field.min}
        max={field.max}
        bind:value={data[field.name]}
      />
    {:else if field.type === "date_time"}
      <FormDatePicker
        {...props}
        range={field.range}
        bind:value={data[field.name]}
      />
    {:else if field.type === "select"}
      <FormSelect
        items={(field.options ?? "").split(",").map((x) => x.trim())}
        {...props}
        let:item
        bind:value={data[field.name]}
      >
        {item}
      </FormSelect>
      <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
    {:else if field.type === "file"}
      <FilePicker {...props} bind:value={data[field.name]} />
    {:else if field.type === "image"}
      <FilePicker type="image" {...props} bind:value={data[field.name]} />

      <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
    {:else if field.type === "switch"}
      <FormSwitch {...props} bind:checked={data[field.name]} />
    {:else if field.type === "relation"}
      <FormDataSelect
        multiple={field.multiple}
        table={field.table}
        title={field.title}
        bind:value={data[field.name]}
      />
    {/if}
  </El>
</FormField>

<style>
  .dynamic-icon {
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 22px;
    background: #57bfffc2;
    border-radius: 50%;
    left: -7px;
    width: 15px;
    height: 15px;
  }

  .dynamic-icon::before {
    content: "+";
    color: white;
    margin-bottom: 1px;
  }
  .dynamic-icon:hover {
    top: 17px;
    background: #1da1f2;
    left: -12px;
    width: 25px;
    height: 25px;
  }
  .dynamic-icon:hover::before {
    font-size: 20px;
    margin-bottom: 5px;
  }
</style>
