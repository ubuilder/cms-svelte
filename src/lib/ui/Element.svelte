<script lang="ts">
  import ComponentWrapper from "$lib/components/editor/ComponentWrapper.svelte";

  export let element = {};

  export let components = {};
  export let mode: "edit" | "view" = "view";

  console.log({ element, components });
  let type = element.type ?? "html";
  let props = element.props ?? {}; // dynamic types
  let component = components[element.type] ?? null;
  let slot = element.slot ?? [];
</script>

{#if typeof element === "string"}
  {#if mode === "edit"}
    <span contenteditable bind:textContent={element}>{element}</span>
  {:else}
    {element}
  {/if}
{:else if slot.length > 0}
  {#if mode === "edit"}
    <ComponentWrapper>
      <svelte:component this={component} {props}>
        {#each slot as slotItem}
          <svelte:self {mode} element={slotItem} {components} />
        {/each}
      </svelte:component>
    </ComponentWrapper>
  {:else}
    <svelte:component this={component} {props}>
      {#each slot as slotItem}
        <svelte:self {mode} element={slotItem} {components} />
      {/each}
    </svelte:component>
  {/if}
{:else if mode === "edit"}
  <ComponentWrapper>
    <svelte:component this={component} {props} />
  </ComponentWrapper>
{:else}
  <svelte:component this={component} {props} />
{/if}
