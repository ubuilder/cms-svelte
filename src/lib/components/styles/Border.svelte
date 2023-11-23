<script lang="ts">
  import { El, Icon } from 'yesvelte'
  export let responsiveMode
  export let props
  export let set
  export let getExactValue

  let activeSide: 'b' | 'bt' | 'bb' | 'bs' | 'be' = 'b'
  let activeSidde: '' | 'T' | 'B' | 'S' | 'E' = ''
  $: {
    activeSidde = activeSide[1]?.toUpperCase() ?? ''
  }
  let value = getExactValue(activeSide)
</script>

<El class="">
  <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
    <div class="font-bold">Width:</div>
    <div class="flex gap-1">
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={value == 1}
        class:!bg-blue-500={value == 1}
        on:click={() => set(activeSide, 1)}>1</button>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={value == 2}
        class:!bg-blue-500={value == 2}
        on:click={() => set(activeSide, 2)}>2</button>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={value == 3}
        class:!bg-blue-500={value == 3}
        on:click={() => set(activeSide, 3)}>3</button>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={value == 4}
        class:!bg-blue-500={value == 4}
        on:click={() => set(activeSide, 4)}>4</button>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={value == 8}
        class:!bg-blue-500={value == 8}
        on:click={() => set(activeSide, 8)}>8</button>
    </div>
  </El>
  <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
    <div class="font-bold">Sides:</div>
    <div class="flex gap-1">
      <button
        class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={activeSide == 'b'}
        class:!bg-blue-500={activeSide == 'b'}
        on:click={() => (activeSide = 'b')}><Icon mb="2" name="border-all" /></button>
      <button
        class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={activeSide == 'bt'}
        class:!bg-blue-500={activeSide == 'bt'}
        on:click={() => (activeSide = 'bt')}><Icon mb="2" name="border-top" /></button>
      <button
        class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={activeSide == 'bb'}
        class:!bg-blue-500={activeSide == 'bb'}
        on:click={() => (activeSide = 'bb')}><Icon mb="2" name="border-bottom" /></button>
      <button
        class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={activeSide == 'bs'}
        class:!bg-blue-500={activeSide == 'bs'}
        on:click={() => (activeSide = 'bs')}><Icon mb="2" name="border-left" /></button>
      <button
        class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:text-white={activeSide == 'be'}
        class:!bg-blue-500={activeSide == 'be'}
        on:click={() => (activeSide = 'be')}><Icon mb="2" name="border-right" /></button>
    </div>
  </El>

  <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
    <div class="font-bold">Style:</div>
    <div class="flex gap-1">
      {#each ['solid', 'dotted', 'dashed', 'none'] as style}
      {@const _value = getExactValue(`borderStyle${activeSidde}`)}
        <button
          class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
          class:text-white={_value == style}
          class:!bg-blue-500={_value == style}
          on:click={() => set(`borderStyle${activeSidde}`, style)}>
          {#if style == 'solid'}
            <Icon name="circle" />
          {:else}
            <Icon name="circle-{style}" />
          {/if}
        </button>
      {/each}
    </div>
  </El>

  <!-- <FormCheckboxGroup label="Select Language" inline color="primary" {items} bind:value /> -->
</El>
