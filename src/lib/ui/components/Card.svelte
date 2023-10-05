<script lang="ts">
    import { Card, CardBody, CardHeader, CardTitle, El, FormInput, FormSelect } from "yesvelte";
  import SlotList from "../SlotList.svelte";
  import {components} from '$lib/ui'
  import Element from "../Element.svelte";
  
    export let props: any = {};
    export let items: any = {};
    export let edit = false;
  </script>

  {#if edit}
    <El p="3">
      <FormInput label="Title" bind:value={props.title} />
      <SlotList bind:slots={props.slot} {items} />
    </El>
  {:else}
    <Card>
        {#if props.title}
        <CardHeader>
            <CardTitle>
                {props.title}
            </CardTitle>
        </CardHeader>
        {/if}
        <CardBody>
            {#each props.slot as slot}
                <Element element={{ ...slot, slot: slot.props.slot }} {items} {components} />
            {/each}
        </CardBody>
    </Card>
  {/if}
  