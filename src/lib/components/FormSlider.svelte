<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { Button, Card, Dropdown, DropdownItem, DropdownMenu, El, FormSelect, FormSlider, Input, SliderKnob } from 'yesvelte'
  export let attribute: string;
  export let negative:boolean = false;

  let unit:string = 'px';
  let num = 0

  export let value: string = '';

  onMount(() => {
    if(value.endsWith('px')) {
        num = +value.replace('px', '')
        unit = 'px'
    } else if (value.endsWith('%')) {
        num = +value.replace('%', '')
        unit = '%'
    }
  })
  $:console.log({unit}, {value})

  const dispatch = createEventDispatcher()

  let loaded = false

  function change() {
    if(!loaded) return
    dispatch('change', `${num}${unit}`)
  }

  onMount(() => {
    setTimeout(() => {
      loaded = true
    }, 1000)
  })
  
  $: {
    num;
    unit;
    change()
  }
  
</script>

<!-- <El row> -->
        <El class="flex justify-between items-center m-1">
            <El>
                {attribute}
            </El>
            <El>
              {#if unit === 'px'}
              <Button size="sm">
                {#if negative}
                <input class="py-0 !bg-gray-200 px-2 h-[18px] border-none w-[60px]" step="4" type="number" bind:value={num}/>
                {:else}
                <input class="py-0 !bg-gray-200 px-2 h-[18px] border-none w-[60px]" step="4" min="0" type="number" bind:value={num}/>
                {/if}
              </Button>
              {/if}
                <Dropdown  autoClose arrow={false} bind:value={unit}>
                    <button class="!bg-gray-200 px-1" slot="target">{#if unit==='%'}{num}{/if}{unit}</button>
                    <DropdownMenu>
                      <DropdownItem on:click={() => unit = 'px'}>px</DropdownItem>
                      <DropdownItem on:click={() => unit = '%'}>%</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
            </El>
          </El>
          <El m=2>
            {#if unit === '%'}
            <FormSlider color="blue" connect >
                <SliderKnob bind:value={num} />
            </FormSlider>
            {/if}
          </El>
    
<!-- <i>value: {value}</i> -->
<style>
  :global(.y-slider-connects) {
    background-color: #20202020;
  }
</style>