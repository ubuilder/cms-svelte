<script context="module">
    export const data = {
    props: [
      {type: 'plain_text', name: 'Text'},
      {type: 'plain_text', name: 'Color'},
    ],
    hasSlot: false
  }
</script>

<script lang="ts">
 import { Button, FormInput } from "yesvelte";



 export let props: any = {};

 export let edit = false;
</script>

<!-- 
  
{#if edit}
  Edit Button
{:else}
  <Button {...$$restProps}>
    <slot />
  </Button>
{/if}

-->
  {#if edit}
  <FormInput  label="Text" bind:value={props.text} />
  <FormInput  label="Color" bind:value={props.color} />
  <FormInput  label="type"  bind:value={props.type} />

  {:else}
    <Button type={props.type} color={props.color} {...$$restProps}>
      {props.text}
    </Button>
  {/if}
