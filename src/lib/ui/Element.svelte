<script lang="ts">
  import { renderVariable } from "$lib/helpers";
  import { El } from "yesvelte";

  export let element: any = {};

  export let components: any = {};
  export let mode: "edit" | "view" = "view";
  export let items: any = {};

  let props = element.props ?? {}; // dynamic types
  console.log({element}, components[element.type])
  let component = components[element.type]?.[mode] ?? undefined;
  let slot = element.slot ?? [];
</script>

{#if typeof element === "string"}
  {renderVariable(element, items)}
{:else if slot.length > 0}
{#if component}
  <svelte:component
    this={component}
    bind:props
    {items}
  >
    {#each slot as slotItem}
      <svelte:self {mode} bind:element={slotItem} {items} {components} />
    {/each}
  </svelte:component>
  {/if}
{:else}
{#if component}
  <svelte:component
    this={component}
    bind:props
    {items}
  />
  {/if}
{/if}
