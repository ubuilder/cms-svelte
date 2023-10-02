<script lang="ts">
  import DragWrapper from "$lib/components/editor/DragWrapper.svelte";
  import Sidebar from "$lib/components/editor/Sidebar.svelte";
  import DropZone from "$lib/components/editor/DropZone.svelte";
  import { components as componentList } from "$lib/components/editor/components";
  import "./style.css";
  import Header from "$lib/components/editor/Header.svelte";
  import ControlPanel from "$lib/components/editor/ControlPanel.svelte";
  import tabler from "yesvelte/css/tabler.min.css?url";
  import { Element, components } from "$lib/ui/index";
  import Wrapper from "$lib/components/editor/Wrapper.svelte";
  import { selectedComponent } from "$lib/stores/selectedComponent";
  let componentFocusIn = false;
  let screenSize: "laptop" | "tablet" | "mobile" = "laptop";
  export let data;
  let dropZone;
  $:console.log('selectedComponent', $selectedComponent)

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href={tabler} />
</svelte:head>
<div class="home">
  <div class="1sidebar">
    <Header bind:screenSize />
    <Sidebar>
      {#if !componentFocusIn}
        {#each componentList as { name, image, template }}
          <DragWrapper
            {name}
            {image}
            {template} />
        {/each}
      {:else}
        <ControlPanel />
      {/if}
    </Sidebar>
  </div>
  <DropZone
    bind:dropZone
    {screenSize}
    on:componentFocusOut={(e) => (componentFocusIn = false)}
    on:componentFocusIn={() => {
      componentFocusIn = true;
    }}>
    {#each data.page.slot as slot}
      <Element
        element={slot}
        {components}/>
    {/each}
    <Wrapper
      bind:dropZone />
  </DropZone>
</div>

<style>
  .home {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 5px;
    background: linear-gradient(90deg, #c9c9c6, #f7f7f7, #f7f7f7, #c9c9c6);
  }
  .sidebar {
    height: 100vh;
    background-color: white;
  }
</style>
