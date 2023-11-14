<script lang=ts>
  import { Popover, PopoverBody } from "yesvelte"

  export let colors:any[]=[]
    
</script>


<Popover placement="bottom-start">
    <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
      {#each colors as color}
        <div class="p-[1px] w-1/10 hover:shadow-lg">
          <div
            on:click={() => set({ bgColor: color })}
            class="bg-{color} cursor-pointer h-4 w-4">
          </div>
        </div>
      {/each}
      <div class="p-[1px] w-1/10 hover:shadow-lg">
        <div
          on:click={() => set({ bgColor: 'white' })}
          class="bg-white cursor-pointer h-4 w-4">
        </div>
      </div>
      <div class="p-[1px] w-1/10 hover:shadow-lg">
        <div
          on:click={() => set({ bgColor: 'black' })}
          class="bg-black cursor-pointer h-4 w-4">
        </div>
      </div>
    </PopoverBody>
  </Popover>