<script lang="ts">
    import { Card, CardBody, CardHeader, CardTitle, El, FormInput, FormSelect } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import {components} from '$lib/ui'
  import Element from "../Element.svelte";
  import DynamicFormField from "$lib/components/content/DynamicFormField.svelte";
  import Image from "./Image.svelte";
  
    export let props: any = {};
    export let items: any = {};
    export let edit = false;
  </script>

  {#if edit}
    <El p="3">
      <DynamicFormField type="plain_text" {items} label="Title" bind:value={props.title} />
      <DynamicFormField type="image" {items} label="Card Image" bind:value={props.image} />
      <SlotList bind:slots={props.slot} {items} />
    </El>
  {:else}
    <Card mb="3">
        {#if props.title}
        <CardHeader>
            <CardTitle>
                {props.title}
            </CardTitle>
        </CardHeader>
        {/if}
        {#if props.image}
          <img src="/files/{props.image}" alt={props.title} />
        {/if}
        <CardBody>
            {#each props.slot as slot}
                <Element element={{ ...slot, slot: slot.props.slot }} {items} {components} />
            {/each}
        </CardBody>
    </Card>
  {/if}
  