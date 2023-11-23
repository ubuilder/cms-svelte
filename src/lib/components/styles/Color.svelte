<script>
  import { El, FormField, Popover, PopoverBody } from 'yesvelte'
  export let responsiveMode
  export let props
  export let set
  export let colors
  export let getExactValue
</script>

<FormField label="Colors">
  <El class="flex gap-2">
    <button
      class="flex flex-1 items-center border border-gray-300 font-bold py-2 px-4 rounded bg-gray-200">
      <div
        class="w-4 h-4 me-2 border border-gray-300 bg-{getExactValue("bg")}">
      </div>
      Background
    </button>
    <Popover placement="bottom-start">
      <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
        {#each colors as color}
          <div class="p-[1px] w-1/10 hover:shadow-lg">
            <div on:click={() => set('bg', color)} class="bg-{color} cursor-pointer h-4 w-4"></div>
          </div>
        {/each}
        <div class="p-[1px] w-1/10 hover:shadow-lg">
          <div on:click={() => set('bg', 'white')} class="bg-white cursor-pointer h-4 w-4">
          </div>
        </div>
        <div class="p-[1px] w-1/10 hover:shadow-lg">
          <div on:click={() => set('bg', 'black')} class="bg-black cursor-pointer h-4 w-4">
          </div>
        </div>
        <div class="p-[1px] w-1/10 border border-gray-200 hover:shadow-lg">
          <div on:click={() => set('bg', '')} class="bg-transparent cursor-pointer h-4 w-4"></div>
        </div>
      </PopoverBody>
    </Popover>

    <button
      class="flex flex-1 items-center border border-gray-300 font-bold py-2 px-4 rounded bg-gray-200">
      <div
        class="w-4 h-4 me-2 border border-gray-300 bg-{getExactValue('textColor')}">
      </div>
      Text
    </button>
    <Popover placement="bottom-start">
      <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
        {#each colors as color}
          <div class="p-[1px] w-1/10 hover:shadow-lg">
            <div on:click={() => set('textColor', color)} class="bg-{color} cursor-pointer h-4 w-4">
            </div>
          </div>
        {/each}
        <div class="p-[1px] w-1/10 hover:shadow-lg">
          <div
            on:click={() => set('textColor', 'white')}
            class="bg-white cursor-pointer h-4 w-4">
          </div>
        </div>
        <div class="p-[1px] w-1/10 hover:shadow-lg">
          <div
            on:click={() => set('textColor', 'black')}
            class="bg-black cursor-pointer h-4 w-4">
          </div>
        </div>
        <div class="p-[1px] w-1/10 border border-gray-200 hover:shadow-lg">
          <div on:click={() => set('textColor', '')} class="bg-transparent cursor-pointer h-4 w-4">
          </div>
        </div>
      </PopoverBody>
    </Popover>
  </El>
</FormField>
