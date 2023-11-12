<script lang="ts">
  import { onMount } from 'svelte'
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    El,
    FormField,
    FormInput,
    FormSelect,
    Icon,
    Popover,
    PopoverBody,
    PopoverHeader,
    Tooltip,
  } from 'yesvelte'
  import FormSlider from './FormSlider.svelte'

  export let value: string

  let props: any = {}

  function parse(value: string = '') {
    const classes = value.split(' ')

    for (let index in classes) {
      let klass = classes[index]
      if (klass.startsWith('bg-')) {
        props.bgColor = klass.substring(3)
      }

      if (klass.startsWith('text-')) {
        if (colorNames.includes(klass.slice(5))) {
          props.textColor = klass.substring(5)
        } else {
          props.fontSize = klass.substring(5)
        }
      }

      if (klass.startsWith('items-')) {
        props.items = klass.substring(6)
      }
      if (klass.startsWith('justify-')) {
        props.justify = klass.substring(8)
      }
      if (klass.startsWith('flex-')) {
        props.flexDirection = klass.substring(5)
      }

      if (klass.startsWith('w-[')) {
        props.width = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('h-[')) {
        props.height = klass.substring(3, klass.length - 1)
      }

      // padding sizing ......................................................
      if (klass.startsWith('pt-[')) {
        props.topPadding = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('pl-[')) {
        props.leftPadding = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('pb-[')) {
        props.bottomPadding = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('pr-[')) {
        props.rightPadding = klass.substring(3, klass.length - 1)
      }

      // margin sizing ......................................................
      if (klass.startsWith('mt-[')) {
        props.topMargin = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('ml-[')) {
        props.leftMargin = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('mb-[')) {
        props.bottomMargin = klass.substring(3, klass.length - 1)
      }

      if (klass.startsWith('mr-[')) {
        props.rightMargin = klass.substring(3, klass.length - 1)
      }

      if (klass == '__') {
        props.Class = classes.slice(+index + 1).join(' ')
        break
      }
    }
  }

  $: parse(value)

  let colorNames = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'sky',
    'emerald',
    'teal',
    'pink',
    'violet',
    'indigo',
    'amber',
    'gray',
  ]

  let colorVariants = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  $: colors = colorNames.map((name) => colorVariants.map((variant) => `${name}-${variant}`)).flat()

  function set(_props: any) {
    props = { ...props, ..._props }
    console.log('set: ', props, _props)
    value = ''
    if (props.flexDirection) {
      value += 'flex flex-' + props.flexDirection
    }

    if (props.items) {
      value += ` items-` + props.items
    }

    if (props.justify) {
      value += ` justify-` + props.justify
    }

    if (props.bgColor) {
      value += ` bg-` + props.bgColor
    }

    if (props.textColor) {
      value += ` text-` + props.textColor
    }

    if (props.fontSize) {
      value += ` text-` + props.fontSize
    }

    if (props.width) {
      value += ` w-[` + props.width + ']'
    }

    // hight .......................
    if (props.height) {
      value += ` h-[` + props.height + ']'
    }

    if (props.topPadding) {
      value += ` pt-[` + props.topPadding + ']'
    }

    if (props.leftPadding) {
      value += ` pl-[` + props.leftPadding + ']'
    }

    if (props.bottomPadding) {
      value += ` pb-[` + props.bottomPadding + ']'
    }

    if (props.rightPadding) {
      value += ` pr-[` + props.rightPadding + ']'
    }

    // margin sizing ....................................................

    if (props.topMargin) {
      value += ` mt-[` + props.topMargin + ']'
    }

    if (props.leftMargin) {
      value += ` ml-[` + props.leftMargin + ']'
    }

    if (props.bottomMargin) {
      value += ` mb-[` + props.bottomMargin + ']'
    }

    if (props.rightMargin) {
      value += ` mr-[` + props.rightMargin + ']'
    }

    value += ' __ '

    if (props.Class) {
      value += props.Class
    }
  }

  let sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']
</script>

<El row>
  <FormSlider attribute="Width" value={props.width} on:change={(e) => set({ width: e.detail })} />

  <FormSlider attribute="Hight" value={props.height} on:change={(e) => set({ height: e.detail })} />

  <!--padding sizing .............................................-->
  <Button class="m-1">Padding</Button>
  <Popover trigger="click">
    <PopoverBody>
      <FormSlider
        attribute="Top"
        value={props.topPadding}
        on:change={(e) => set({ topPadding: e.detail })} />
      <FormSlider
        attribute="Left"
        value={props.leftPadding}
        on:change={(e) => set({ leftPadding: e.detail })} />
      <FormSlider
        attribute="bottom"
        value={props.bottomPadding}
        on:change={(e) => set({ bottomPadding: e.detail })} />
      <FormSlider
        attribute="Right"
        value={props.rightPadding}
        on:change={(e) => set({ rightPadding: e.detail })} />
    </PopoverBody>
  </Popover>

  <!--margin sizing .............................................-->

  <Button class="m-1">Margin</Button>
  <Popover trigger="click">
    <PopoverBody>
      <FormSlider
        negative={true}
        attribute="Top"
        value={props.topMargin}
        on:change={(e) => set({ topMargin: e.detail })} />
      <FormSlider
        negative={true}
        attribute="Left"
        value={props.leftMargin}
        on:change={(e) => set({ leftMargin: e.detail })} />
      <FormSlider
        negative={true}
        attribute="bottom"
        value={props.bottomMargin}
        on:change={(e) => set({ bottomMargin: e.detail })} />
      <FormSlider
        negative={true}
        attribute="Right"
        value={props.rightMargin}
        on:change={(e) => set({ rightMargin: e.detail })} />
    </PopoverBody>
  </Popover>

  <FormSelect
    placeholder={props.fontSize}
    items={sizes}
    label="Font size"
    bind:value={props.fontSize}
    on:change={(e) => set({ fontSize: e.target.value })}
    let:item>
    <El>{item}</El>
  </FormSelect>

  <FormInput
    label="Class"
    bind:value={props.Class}
    on:change={(e) => set({ Class: e.target.value })} />
  {value}
  <FormField label="Colors">
    <div class="flex flex-row gap-2">
      <button class="flex-1 border border-gray-200 py-2 px-4 bg-gray-200 !bg-{props.bgColor}"
        >Background</button>
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
              class="bg-{'white'} cursor-pointer h-4 w-4">
            </div>
          </div>
          <div class="p-[1px] w-1/10 hover:shadow-lg">
            <div
              on:click={() => set({ bgColor: 'black' })}
              class="bg-{'black'} cursor-pointer h-4 w-4">
            </div>
          </div>
        </PopoverBody>
      </Popover>

      <button class="flex-1 border border-gray-200 py-2 px-4 bg-gray-200 !bg-{props.textColor}"
        >Text</button>
      <Popover placement="bottom-start">
        <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
          {#each colors as color}
            <div class="p-[1px] w-1/10 hover:shadow-lg">
              <div
                on:click={() => set({ textColor: color })}
                class="bg-{color} cursor-pointer h-4 w-4">
              </div>
            </div>
          {/each}
          <div class="p-[1px] w-1/10 hover:shadow-lg">
            <div
              on:click={() => set({ textColor: 'white' })}
              class="bg-{'white'} cursor-pointer h-4 w-4">
            </div>
          </div>
          <div class="p-[1px] w-1/10 hover:shadow-lg">
            <div
              on:click={() => set({ textColor: 'black' })}
              class="bg-{'black'} cursor-pointer h-4 w-4">
            </div>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  </FormField>

  <FormField label="Flex Direction">
    <div class="flex">
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.flexDirection === 'row'}
        class:text-white={props.flexDirection === 'row'}
        on:click={() => set({ flexDirection: 'row' })}
        ><Icon size="sm" name="arrow-right" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.flexDirection === 'col'}
        class:text-white={props.flexDirection === 'col'}
        on:click={() => set({ flexDirection: 'col' })}
        ><Icon size="sm" name="arrow-bottom" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.flexDirection === 'row-reverse'}
        class:text-white={props.flexDirection === 'row-reverse'}
        on:click={() => set({ flexDirection: 'row-reverse' })}
        ><Icon size="sm" name="arrow-left" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.flexDirection === 'col-reverse'}
        class:text-white={props.flexDirection === 'col-reverse'}
        on:click={() => set({ flexDirection: 'col-reverse' })}
        ><Icon size="sm" name="arrow-top" /></button>
    </div>
  </FormField>

  <FormField label="Align Items">
    <div class="flex">
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.items === 'start'}
        class:text-white={props.items === 'start'}
        on:click={() => set({ items: 'start' })}><Icon size="sm" name="arrow-right" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.items === 'center'}
        class:text-white={props.items === 'center'}
        on:click={() => set({ items: 'center' })}><Icon size="sm" name="arrow-bottom" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.items === 'end'}
        class:text-white={props.items === 'end'}
        on:click={() => set({ items: 'end' })}><Icon size="sm" name="arrow-left" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.items === 'stretch'}
        class:text-white={props.items === 'stretch'}
        on:click={() => set({ items: 'stretch' })}><Icon size="sm" name="arrow-top" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.items === 'baseline'}
        class:text-white={props.items === 'stretch'}
        on:click={() => set({ items: 'baseline' })}><Icon size="sm" name="arrow-top" /></button>
    </div>
  </FormField>
  <FormField label="Justify Content">
    <div class="flex">
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'start'}
        class:text-white={props.justify === 'start'}
        on:click={() => set({ justify: 'start' })}><Icon size="sm" name="arrow-right" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'center'}
        class:text-white={props.justify === 'center'}
        on:click={() => set({ justify: 'center' })}><Icon size="sm" name="arrow-bottom" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'end'}
        class:text-white={props.justify === 'end'}
        on:click={() => set({ justify: 'end' })}><Icon size="sm" name="arrow-left" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'between'}
        class:text-white={props.justify === 'stretch'}
        on:click={() => set({ justify: 'between' })}><Icon size="sm" name="arrow-top" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'evenly'}
        class:text-white={props.justify === 'stretch'}
        on:click={() => set({ justify: 'evenly' })}><Icon size="sm" name="arrow-top" /></button>
      <button
        class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
        class:!bg-blue-500={props.justify === 'around'}
        class:text-white={props.justify === 'stretch'}
        on:click={() => set({ justify: 'around' })}><Icon size="sm" name="arrow-top" /></button>
    </div>
  </FormField>

  Margin Padding width height font size font weight
</El>
