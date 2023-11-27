<script>
  import { updated } from '$app/stores'
  import { El, FormField, Icon, Tooltip } from 'yesvelte'
  export let props
  export let set
  export let responsiveMode
  export let getExactValue
  let flexDirection
  let items
  let justify

  $: {
    props
    flexDirection = getExactValue('flexDirection')
    items = getExactValue('items')
    justify = getExactValue('justify')
  }
</script>

<El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
  <div class="font-bold">Direction:</div>
  <div>
    
    <button
      class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
      class:!bg-blue-500={flexDirection === 'row'}
      class:text-white={flexDirection === 'row'}
      on:click={() => {
        set('flexDirection', 'row')
      }}><img src="/svg/columns.svg" /></button>
    <Tooltip placement="top">Row</Tooltip>
    <button
      class="p-1 flex items-center justify-center w-6 h-6 rounded-r inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
      class:!bg-blue-500={flexDirection === 'col'}
      class:text-white={flexDirection === 'col'}
      on:click={() => set('flexDirection', 'col')}><img src="/svg/rows.svg" /></button>
    <Tooltip placement="top">Column</Tooltip>
  </div>
</El>


{#if flexDirection == "row"}


<El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
  <div class="font-bold">Alignments:</div>
  <div>
    <div class="flex justify-center items-center mb-1">
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-t inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={items === 'start'}
        class:text-white={items === 'start'}
        on:click={() => {
          set('items', 'start')
        }}><Icon name="arrow-up" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>
    <div>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={justify === 'start'}
        class:text-white={justify === 'start'}
        on:click={() => {
          set('justify', 'start')
        }}><Icon name="arrow-left" /></button>
      <Tooltip placement="top">Row</Tooltip>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={(items === 'center' && justify == 'center')}
        class:text-white={(items === 'center' && justify == 'center')}
        on:click={() => {
          set('items', 'center')
          set('justify', 'center')
        }}><Icon name="focus-2" /></button>
      <Tooltip placement="top">Row</Tooltip>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-r inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={justify === 'end'}
        class:text-white={justify === 'end'}
        on:click={() => {
          set('justify', 'end')
        }}><Icon name="arrow-right" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>
    <div class="flex justify-center items-center">
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-b inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={items === 'end'}
        class:text-white={items === 'end'}
        on:click={() => {
          set('items', 'end')
        }}><Icon name="arrow-down" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>

    <!-- 
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'row-reverse'}
      class:text-white={flexDirection === 'row-reverse'}
      on:click={() => set('flexDirection', 'row-reverse')}
      ><Icon size="sm" name="arrow-left" /></button>
      <Tooltip placement = 'top'>Reverse row</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'col-reverse'}
      class:text-white={flexDirection === 'col-reverse'}
      on:click={() => set('flexDirection', 'col-reverse')}
      ><Icon size="sm" name="arrow-top" /></button>
      <Tooltip placement = 'top'>Reverse Column</Tooltip> -->
  </div>
</El>
{:else}

<El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
  <div class="font-bold">Alignments:</div>
  <div>
    <div class="flex justify-center items-center mb-1">
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-t inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={"justify" === 'start'}
        class:text-white={"justify" === 'start'}
        on:click={() => {
          set('justify', 'start')
        }}><Icon name="arrow-up" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>
    <div>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={"items" === 'start'}
        class:text-white={"items" === 'start'}
        on:click={() => {
          set('items', 'start')
        }}><Icon name="arrow-left" /></button>
      <Tooltip placement="top">Row</Tooltip>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={flexDirection === 'row'}
        class:text-white={flexDirection === 'row'}
        on:click={() => {
          set('flexDirection', 'row')
        }}><Icon name="focus-2" /></button>
      <Tooltip placement="top">Row</Tooltip>
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-r inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={"items" === 'end'}
        class:text-white={"items" === 'end'}
        on:click={() => {
          set('items', 'end')
        }}><Icon name="arrow-right" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>
    <div class="flex justify-center items-center">
      <button
        class="p-1 flex items-center justify-center w-6 h-6 rounded-b inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
        class:!bg-blue-500={"justify" === 'end'}
        class:text-white={"justify" === 'end'}
        on:click={() => {
          set('justify', 'end')
        }}><Icon name="arrow-down" /></button>
      <Tooltip placement="top">Row</Tooltip>
    </div>

    <!-- 
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'row-reverse'}
      class:text-white={flexDirection === 'row-reverse'}
      on:click={() => set('flexDirection', 'row-reverse')}
      ><Icon size="sm" name="arrow-left" /></button>
      <Tooltip placement = 'top'>Reverse row</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'col-reverse'}
      class:text-white={flexDirection === 'col-reverse'}
      on:click={() => set('flexDirection', 'col-reverse')}
      ><Icon size="sm" name="arrow-top" /></button>
      <Tooltip placement = 'top'>Reverse Column</Tooltip> -->
  </div>
</El>
{/if}

<!-- <FormField label="Align Items">
  <div class="flex">
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'start'}
      class:text-white={items === 'start'}
      on:click={() => set('items', 'start')}
      ><img style="transform:rotate(90deg)" src="/svg/align-start.svg" /></button>
    <Tooltip placement="top">Start</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'center'}
      class:text-white={items === 'center'}
      on:click={() => set('items', 'center')}><img src="/svg/align-center.svg" /></button>
    <Tooltip placement="top">Center</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'end'}
      class:text-white={items === 'end'}
      on:click={() => set('items', 'end')}
      ><img style="transform:rotate(270deg)" src="/svg/align-start.svg" /></button>
    <Tooltip placement="top">End</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'stretch'}
      class:text-white={items === 'stretch'}
      on:click={() => set('items', 'stretch')}><img src="/svg/align-stretch.svg" /></button>
    <Tooltip placement="top">Stretch</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'baseline'}
      class:text-white={items === 'stretch'}
      on:click={() => set('items', 'baseline')}><Icon size="sm" name="arrow-top" /></button>
    <Tooltip placement="top">Baseline</Tooltip>
  </div>
</FormField>

<FormField label="Justify Content">
  <div class="flex">
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'start'}
      class:text-white={justify === 'start'}
      on:click={() => set('justify', 'start')}><Icon size="sm" name="arrow-right" /></button>
    <Tooltip placement="top">Start</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'center'}
      class:text-white={justify === 'center'}
      on:click={() => set('justify', 'center')}><Icon size="sm" name="arrow-bottom" /></button>
    <Tooltip placement="top">Center</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'end'}
      class:text-white={justify === 'end'}
      on:click={() => set('justify', 'end')}><Icon size="sm" name="arrow-left" /></button>
    <Tooltip placement="top">End</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'between'}
      class:text-white={justify === 'between'}
      on:click={() => set('justify', 'between')}><Icon size="sm" name="arrow-top" /></button>
    <Tooltip placement="top">Row</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'evenly'}
      class:text-white={justify === 'evenly'}
      on:click={() => set('justify', 'evenly')}><Icon size="sm" name="arrow-top" /></button>
    <Tooltip placement="top">Evenly</Tooltip>

    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'around'}
      class:text-white={justify === 'around'}
      on:click={() => set('justify', 'around')}><Icon size="sm" name="arrow-top" /></button>
    <Tooltip placement="top">Around</Tooltip>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'stretch'}
      class:text-white={justify === 'stretch'}
      on:click={() => set('justify', 'stretch')}><Icon size="sm" name="arrow-top" /></button>
    <Tooltip placement="top">Stretch</Tooltip>
  </div>
</FormField> -->
