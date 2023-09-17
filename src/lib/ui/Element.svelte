<script>  
    export let element = {};
  
    export let components = {}
  
    console.log({element, components})
    let type = element.type ?? "html";
    let props = element.props ?? {}; // dynamic types
    let component = components[element.type] ?? null;
    let slot = element.slot ?? [];
  </script>
  
  {#if typeof element === "string"}
    {element}
  {:else if type === "html"}
    {#if slot.length > 0}
      <svelte:element this={element.props.tag} props={element.props}>
        {#each slot as slotItem}
          <svelte:self element={slotItem} {components}/>
        {/each}
      </svelte:element>
    {:else}
      <svelte:element this={element.props.tag} props={element.props} />
    {/if}
  {:else if slot.length > 0}
    <svelte:component this={component} {props}>
      {#each slot as slotItem}
        <svelte:self element={slotItem} {components} />
      {/each}
    </svelte:component>
  {:else}
    <svelte:component this={component} {props} />
  {/if}
  