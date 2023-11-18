<script>

  import { FormField, Icon } from "yesvelte"

export let props
export let set
export let responsiveMode
</script>
    <FormField label="Flex Direction">
      <div class="flex">
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.flexDirection[responsiveMode] === 'row'}
          class:text-white={props.flexDirection[responsiveMode] === 'row'}
          on:click={() => set('flexDirection', 'row')}
          ><Icon size="sm" name="arrow-right" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.flexDirection[responsiveMode] === 'col'}
          class:text-white={props.flexDirection[responsiveMode] === 'col'}
          on:click={() => set('flexDirection', 'col')}
          ><Icon size="sm" name="arrow-bottom" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.flexDirection[responsiveMode] === 'row-reverse'}
          class:text-white={props.flexDirection[responsiveMode] === 'row-reverse'}
          on:click={() => set('flexDirection', 'row-reverse')}
          ><Icon size="sm" name="arrow-left" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.flexDirection[responsiveMode] === 'col-reverse'}
          class:text-white={props.flexDirection[responsiveMode] === 'col-reverse'}
          on:click={() => set('flexDirection', 'col-reverse')}
          ><Icon size="sm" name="arrow-top" /></button>
      </div>
    </FormField>

    <FormField label="Align Items">
      <div class="flex">
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.items[responsiveMode] === 'start'}
          class:text-white={props.items[responsiveMode] === 'start'}
          on:click={() => set('items', 'start')}><Icon size="sm" name="arrow-right" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.items[responsiveMode] === 'center'}
          class:text-white={props.items[responsiveMode] === 'center'}
          on:click={() => set('items', 'center')}><Icon size="sm" name="arrow-bottom" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.items[responsiveMode] === 'end'}
          class:text-white={props.items[responsiveMode] === 'end'}
          on:click={() => set('items', 'end')}><Icon size="sm" name="arrow-left" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.items === 'stretch'}
          class:text-white={props.items === 'stretch'}
          on:click={() => set('items', 'stretch')}><Icon size="sm" name="arrow-top" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.items[responsiveMode] === 'baseline'}
          class:text-white={props.items[responsiveMode] === 'stretch'}
          on:click={() => set('items', 'baseline')}><Icon size="sm" name="arrow-top" /></button>
      </div>
    </FormField>

    <FormField label="Justify Content">
      <div class="flex">
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify[responsiveMode] === 'start'}
          class:text-white={props.justify[responsiveMode] === 'start'}
          on:click={() => set('justify', 'start')}><Icon size="sm" name="arrow-right" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify[responsiveMode] === 'center'}
          class:text-white={props.justify[responsiveMode] === 'center'}
          on:click={() => set('justify', 'center')}
          ><Icon size="sm" name="arrow-bottom" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify === 'end'}
          class:text-white={props.justify === 'end'}
          on:click={() => set('justify', 'end')}><Icon size="sm" name="arrow-left" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify[responsiveMode] === 'between'}
          class:text-white={props.justify[responsiveMode] === 'stretch'}
          on:click={() => set('justify', 'between')}><Icon size="sm" name="arrow-top" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify[responsiveMode] === 'evenly'}
          class:text-white={props.justify[responsiveMode] === 'stretch'}
          on:click={() => set('justify', 'evenly')}><Icon size="sm" name="arrow-top" /></button>
        <button
          class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
          class:!bg-blue-500={props.justify[responsiveMode] === 'around'}
          class:text-white={props.justify[responsiveMode] === 'stretch'}
          on:click={() => set('justify', 'around')}><Icon size="sm" name="arrow-top" /></button>
      </div>
    </FormField>