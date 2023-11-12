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

  const dispatch = createEventDispatcher()


  function change() {
    dispatch('change', `${num}${unit}`)
  }

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
                <input class="py-0 px-2 h-[18px] border-none w-[60px]" step="4" type="number" bind:value={num}/>
                {:else}
                <input class="py-0 px-2 h-[18px] border-none w-[60px]" step="4" min="0" type="number" bind:value={num}/>
                {/if}
              </Button>
              {/if}
                <Dropdown style="background-color:white !important" autoClose arrow={false} bind:value={unit}>
                    <Button style="background:white !important" size="sm" slot="target">{#if unit==='%'}{num}{/if}{unit}</Button>
                    <DropdownMenu>
                      <DropdownItem on:click={() => unit = 'px'}>px</DropdownItem>
                      <DropdownItem on:click={() => unit = '%'}>%</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
            </El>
        </El>
        {#if unit === '%'}
        <FormSlider color="blue" connect>
            <SliderKnob bind:value={num} />
        </FormSlider>
        {/if}
    
<!-- <i>value: {value}</i> -->
