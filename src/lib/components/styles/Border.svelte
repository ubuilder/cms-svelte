<script>

  import { El, Icon } from "yesvelte"
  export let responsiveMode
  export let props
  export let set


</script>
    <El class="">
      <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
        <div class="font-bold">Width:</div>
        <div class="flex gap-1">
          <button
            class="p-1 flex items-center justify-center w-6 h-6 rounded-l inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.bt ? props.bt[responsiveMode] : ''}
            class:!bg-blue-500={props.bt ? props.bt[responsiveMode] : ''}
            on:click={() => set('bt', !props.bt[responsiveMode])}>1</button>
          <button
            class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.br ? props.br[responsiveMode] : ''}
            class:!bg-blue-500={props.br ? props.br[responsiveMode] : ''}
            on:click={() => set('br', !props.br[responsiveMode])}>2</button>
          <button
            class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.bl ? props.bl[responsiveMode] : ''}
            class:!bg-blue-500={props.bl ? props.bl[responsiveMode] : ''}
            on:click={() => set('bl', !props.bl[responsiveMode])}>4</button>
          <button
            class="p-1 flex items-center justify-center w-6 h-6 rounded-r inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.bl[responsiveMode]}
            class:!bg-blue-500={props.bl[responsiveMode]}
            on:click={() => set('bl', !props.bl[responsiveMode])}>8</button>
        </div>
      </El>

      <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
        <div class="font-bold">Style:</div>
        <div class="flex gap-1">
          {#each ['solid', 'dotted', 'dashed', 'none'] as style}
            <button
              class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderStyle[responsiveMode] === style}
              class:!bg-blue-500={props.borderStyle[responsiveMode] === style}
              on:click={() => set('borderStyle', style)}><Icon name="circle-{style}" /></button>
          {/each}
        </div>
      </El>

      <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
        <div class="font-bold">Sides:</div>
        <div class="flex gap-1">
          <button
            class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.borderSidesT[responsiveMode]}
            class:!bg-blue-500={props.borderSidesT[responsiveMode]}
            on:click={() => set('borderSidesT', !props.borderSidesT[responsiveMode])}
            ><Icon mb="2" name="border-top" /></button>
          <button
            class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.borderSidesR[responsiveMode]}
            class:!bg-blue-500={props.borderSidesR[responsiveMode]}
            on:click={() => set('borderSidesR', !props.borderSidesR[responsiveMode])}
            ><Icon mb="2" name="border-right" /></button>
          <button
            class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.borderSidesB[responsiveMode]}
            class:!bg-blue-500={props.borderSidesB[responsiveMode]}
            on:click={() => set('borderSidesB', !props.borderSidesB[responsiveMode])}
            ><Icon mb="2" name="border-bottom" /></button>
          <button
            class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
            class:text-white={props.borderSidesL[responsiveMode]}
            class:!bg-blue-500={props.borderSidesL[responsiveMode]}
            on:click={() => set(borderSidesL, !props.borderSidesL[responsiveMode])}
            ><Icon mb="2" name="border-left" /></button>
        </div>
      </El>
      <!-- <FormCheckboxGroup label="Select Language" inline color="primary" {items} bind:value /> -->
    </El>