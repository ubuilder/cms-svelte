<script context="module">
  export const hasSlot = true
</script>

<script lang="ts">
  import { El, FormInput } from "yesvelte";

  export const data = {
    props: [{ type: "plain_text", name: "size" }],
    hasSlot: true,
  };

  export let props: any = {};

export let edit = false;
</script>

{#if edit}
  <FormInput class = 'u-component' label="Size" bind:value={props.size} />
{:else}
  <El container={props.size} {...$$restProps}>
    <slot />
  </El>
{/if}
