<script>
  import { updated } from '$app/stores'
  import { FormField, Icon } from 'yesvelte'
  export let props
  export let set
  export let responsiveMode
  export let getExactValue
  let flexDirection 
  let items 
  let justify

  $:{
    props;
    flexDirection = getExactValue("flex")
    items = getExactValue("items")
    justify = getExactValue("justify")
  }
  $:console.log("props change", {props})
  $:console.log({flexDirection}, {items}, {justify})
</script>

<FormField label="Flex Direction">
  <div class="flex">
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'row'}
      class:text-white={flexDirection === 'row'}
      on:click={() => {set('flexDirection', 'row')}}><Icon size="sm" name="arrow-right" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'col'}
      class:text-white={flexDirection === 'col'}
      on:click={() => set('flexDirection', 'col')}><Icon size="sm" name="arrow-bottom" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'row-reverse'}
      class:text-white={flexDirection === 'row-reverse'}
      on:click={() => set('flexDirection', 'row-reverse')}
      ><Icon size="sm" name="arrow-left" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={flexDirection === 'col-reverse'}
      class:text-white={flexDirection === 'col-reverse'}
      on:click={() => set('flexDirection', 'col-reverse')}
      ><Icon size="sm" name="arrow-top" /></button>
  </div>
</FormField>

<FormField label="Align Items">
  <div class="flex">
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'start'}
      class:text-white={items === 'start'}
      on:click={() => set('items', 'start')}><Icon size="sm" name="arrow-right" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'center'}
      class:text-white={items === 'center'}
      on:click={() => set('items', 'center')}><Icon size="sm" name="arrow-bottom" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'end'}
      class:text-white={items === 'end'}
      on:click={() => set('items', 'end')}><Icon size="sm" name="arrow-left" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'stretch'}
      class:text-white={items === 'stretch'}
      on:click={() => set('items', 'stretch')}><Icon size="sm" name="arrow-top" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={items === 'baseline'}
      class:text-white={items === 'stretch'}
      on:click={() => set('items', 'baseline')}><Icon size="sm" name="arrow-top" /></button>
  </div>
</FormField>

<FormField label="Justify Content">
  <div class="flex">
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'start'}
      class:text-white={justify === 'start'}
      on:click={() => set('justify', 'start')}><Icon size="sm" name="arrow-right" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'center'}
      class:text-white={justify === 'center'}
      on:click={() => set('justify', 'center')}><Icon size="sm" name="arrow-bottom" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'end'}
      class:text-white={justify === 'end'}
      on:click={() => set('justify', 'end')}><Icon size="sm" name="arrow-left" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'between'}
      class:text-white={justify === 'stretch'}
      on:click={() => set('justify', 'between')}><Icon size="sm" name="arrow-top" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'evenly'}
      class:text-white={justify === 'stretch'}
      on:click={() => set('justify', 'evenly')}><Icon size="sm" name="arrow-top" /></button>
    <button
      class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
      class:!bg-blue-500={justify === 'around'}
      class:text-white={justify === 'stretch'}
      on:click={() => set('justify', 'around')}><Icon size="sm" name="arrow-top" /></button>
  </div>
</FormField>
