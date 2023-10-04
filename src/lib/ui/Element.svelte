<script lang="ts">
  import { renderVariable } from "$lib/helpers";

  export let element = {};

  export let components = {};
  export let mode: "edit" | "view" = "view";

  console.log({ element, components });
  let type = element.type ?? "html";

  export let items: any = {};
  let props = element.props ?? {}; // dynamic types
  let component = components[element.type] ?? null;
  let slot = element.slot ?? [];
</script>

{#if typeof element === "string"}
  {renderVariable(element, items)}
{:else if slot.length > 0}
  <svelte:component this={component} props={renderVariable(props, items)} {items}>
    {#each slot as slotItem}
      <svelte:self {mode} element={slotItem} {items} {components} />
    {/each}
  </svelte:component>
{:else}
  <svelte:component this={component} props={renderVariable(props, items)} {items} />
{/if}
