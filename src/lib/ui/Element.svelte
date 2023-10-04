<script lang="ts">
  import hbs from "handlebars";
  import ComponentWrapper from "$lib/components/editor/ComponentWrapper.svelte";

  export let element = {};

  export let components = {};
  export let mode: "edit" | "view" = "view";

  console.log({ element, components });
  let type = element.type ?? "html";

  function get_value(template: string | any) {
    if (typeof template === "string") {
      return hbs.compile(`${template}`)(items);
    } else if (typeof template === "object" && !Array.isArray(template)) {
      const result: any = {};

      Object.keys(template).map((key) => {
        result[key] = get_value(template[key]);
      });
      return result;
    }
    return template;
  }

  export let items: any = {};
  let props = element.props ?? {}; // dynamic types
  let component = components[element.type] ?? null;
  let slot = element.slot ?? [];
</script>

{#if typeof element === "string"}
  {get_value(element)}
{:else if slot.length > 0}
  <svelte:component this={component} props={get_value(props)} {items}>
    {#each slot as slotItem}
      <svelte:self {mode} element={slotItem} {items} {components} />
    {/each}
  </svelte:component>
{:else}
  <svelte:component this={component} props={get_value(props)} {items} />
{/if}
