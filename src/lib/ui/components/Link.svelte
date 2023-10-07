<script lang="ts">
    import FilePicker from "$lib/components/content/FilePicker.svelte";
    import { El, FormField, FormInput, FormSelect } from "yesvelte";
    import SlotList from "../SlotList.svelte";
    import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import Element from "../Element.svelte";
  import {components} from '$lib/ui'
  
    export let props: any = {};
    export let items: any = {}; // [{ text: "Page slot", key: "page.slot" }];
    export let slots: any[] = [];
    export let edit = false;
  </script>
  
  {#if edit}
    <El p="3">
        <El row>

        <DynamicFormField col="6"
        label="URL"
        type="plain_text"
        {items}
        bind:value={props.href}
      />
      <DynamicFormField col="6"
        label="Text"
        type="plain_text"
        {items}
        bind:value={props.text}
      />
    </El>
  
   <!--TODO: use select for page link...  -->
<!--       
      <DynamicFormField
      type="select"
      bind:value={props.container_size}
      {items}
      options={}
      label="Container Size"
    /> -->
  
      <SlotList bind:slots={props.slot} {items} />
    </El>
  {:else}
    <a href={props.href}>
        {#if props.text}
            {props.text}
        {:else}
        <!-- {JSON.stringify(props.slot)} -->
        {#each props.slot as slot}
                <Element element={{ ...slot, slot: slot.props.slot }} {items} {components} />
            {/each}
        {/if}
    </a>
  {/if}
  