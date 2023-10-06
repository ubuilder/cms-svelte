<script lang="ts">
  import { renderVariable } from "$lib/helpers";

  export let element: any = {};

  export let components: any = {};
  export let mode: "edit" | "view" = "view";
  export let items: any = {};

  let props = element.props ?? {}; // dynamic types
  let component = components[element.type] ?? undefined;
  let slot = element.slot ?? [];
</script>

{#if typeof element === "string"}
  {renderVariable(element, items)}
{:else if slot.length > 0}
{#if component}
  <svelte:component
    this={component}
    props={renderVariable(props, items)}
    {items}
  >
    {#each slot as slotItem}
      <svelte:self {mode} element={slotItem} {items} {components} />
    {/each}
  </svelte:component>
  {/if}
{:else}
{#if component}
  <svelte:component
    this={component}
    props={renderVariable(props, items)}
    {items}
  />
  {/if}
{/if}
