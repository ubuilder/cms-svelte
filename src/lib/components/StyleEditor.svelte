<script lang="ts">
  import { onMount } from 'svelte'
  import {
    Accordions,
    El,
    FormField,
    FormInput,
    FormSelect,
    Icon,
    Popover,
    PopoverBody,
  } from 'yesvelte'
  import FormSlider from './FormSlider.svelte'
  import StyleAccordion from './StyleAccordion.svelte'
  import type { Script } from 'vm'

  export let value: string
  let _value: string
  export let responsiveMode = '@xl:'
  $: {
    console.log('responsive', responsiveMode)
  }

  let props: any = {}
  let responsiveBreakPoints = ['@xs:', '@sm:', '@md:', '@lg:', '@xl:']
  function match(klass, value) {
    // let classlist = [
    //   "bg", "text",
    //    "b" ,"bt", 'bs', 'be', 'bb',
    //    "m", 'mt' , "ms", 'me' , "mb",
    //    "p", 'pt' , "ps", 'pe' , "pb",
    //    "p", 'pt' , "ps", 'pe' , "pb",
    //    "w", "h",
    // ]
    if (
      klass.startsWith(`@xs:${value}-`) ||
      klass.startsWith(`@sm:${value}-`) ||
      klass.startsWith(`@md:${value}-`) ||
      klass.startsWith(`@lg:${value}-`)
    ) {
      return true
    }
  }
  function extractResponsiveClasses(value, stile) {
    let res = {}
    value = value.trim().replace('[','').replace(']', "")
    
    if (value.startsWith(`@xs:${stile}-`)) {
      res['@xs:'] = value.split(`@xs:${stile}-`)[1]
    } else if (value.startsWith(`@sm:${stile}-`)) {
      res['@sm:'] = value.split(`@sm:${stile}-`)[1]
    } else if (value.startsWith(`@md:${stile}-`)) {
      res['@md:'] = value.split(`@md:${stile}-`)[1]
    } else if (value.startsWith(`@lg:${stile}-`)) {
      res['@lg:'] = value.split(`@lg:${stile}-`)[1]
    }
    return res
  }

  function parse(value: string = '') {
    const classes = value.split(' ')
    props.m = {}
    props.mt = {}
    props.ml = {}
    props.mr = {}
    props.mb = {}

    props.b = {}
    props.bl = {}
    props.br = {}
    props.bb = {}
    props.bt = {}

    props.p = {}
    props.pb = {}
    props.pt = {}
    props.pl = {}
    props.pr = {}

    props.bg = {}

    props.textColor = {}
    props.fontSize = {}
    props.items = {}
    props.justify = {}
    props.flex = {}
    props.w = {}
    props.h = {}

    props.borderSides = {}
    props.borderSidesT = {}
    props.borderSidesL = {}
    props.borderSidesR = {}
    props.borderSidesB = {}
    props.activeBorders = {t:true, r: true}
    
    props.borderStyle = {}
    props.textColor = {}
    props.flexDirection = {}
    props.justify = {}
    

    for (let index in classes) {
      let klass = classes[index]
      if (match(klass, 'bg')) {
        props.bg = { ...props.bg, ...extractResponsiveClasses(klass, 'bg') }
      }
      if (match(klass, 'text')) {
        if (colorNames.includes(klass.split('-')[1])) {
          props.textColor = { ...props.textColor, ...extractResponsiveClasses(klass, 'text') }
        } else {
          props.fontSize = { ...props.fontSize, ...extractResponsiveClasses(klass, 'text') }
        }
      }

      if (match(klass, 'items')) {
        props.items = { ...props.items, ...extractResponsiveClasses(klass, 'items') }
      }
      if (match(klass, 'justify')) {
        props.justify = { ...props.justify, ...extractResponsiveClasses(klass, 'justify') }
      }
      if (match(klass, 'flex')) {
        props.flex = { ...props.flex, ...extractResponsiveClasses(klass, 'flex') }
      }

      if (match(klass, 'w')) {
        props.w = { ...props.w, ...extractResponsiveClasses(klass, 'w') }
      }

      if (match(klass, 'h')) {
        props.h = { ...props.h, ...extractResponsiveClasses(klass, 'h') }
      }

      // padding sizing ......................................................
      if (match(klass, 'pt')) {
        props.pt = { ...props.pt, ...extractResponsiveClasses(klass, 'pt') }
      }

      if (match(klass, 'pl')) {
        props.pl = { ...props.pl, ...extractResponsiveClasses(klass, 'pl') }
      }

      if (match(klass, 'pb')) {
        props.pb = { ...props.pb, ...extractResponsiveClasses(klass, 'pb') }
      }

      if (match(klass, 'pr')) {
        props.pr = { ...props.pr, ...extractResponsiveClasses(klass, 'pr') }
      }

      // margin sizing ......................................................
      if (match(klass, 'mt')) {
        props.mt = { ...props.mt, ...extractResponsiveClasses(klass, 'mt') }
      }

      if (match(klass, 'ml')) {
        props.ml = { ...props.ml, ...extractResponsiveClasses(klass, 'ml') }
      }

      if (match(klass, 'mb')) {
        props.mb = { ...props.mb, ...extractResponsiveClasses(klass, 'mb') }
      }

      if (match(klass, 'mr')) {
        props.mr = { ...props.mr, ...extractResponsiveClasses(klass, 'mr') }
      }

      // props.borderSides = {
      //   top: false,
      //   right: true,
      //   bottom: false,
      //   left: false,
      // }

      if (klass == '__') {
        props.Class = classes.slice(+index + 1).join(' ')
        break
      }
    }
    console.log('parse: ', props)
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

  function updateProps(key: string, val: string) {
    let currentIndex = responsiveBreakPoints.findIndex((x) => x == responsiveMode)
    if (responsiveMode == '@xs:') currentIndex = 4
    function isSmallerPoints(prop) {
      console.log('reverse:', prop.reverse())
      console.log('in:', responsiveBreakPoints.slice(1, currentIndex))
      const inn = responsiveBreakPoints.slice(1, currentIndex)
      for (let x of prop.reverse()) {
        const index = inn.findIndex((y) => {
          if (x == y) {
            return true
          }
          return false
        })
        if (index !== -1) return inn.length - index
      }
      return false
    }
    if (key) {
      ///check if there is smaller break point added before
      ///if not the set default stlyle to current + 1 and set the current style to default
      ///if yes exits then set the current styl to previous style + 1
      
      //step 1
      props[key][responsiveMode] = val
      //step 2
      if (isSmallerPoints(Object.keys(props[key] ?? {})) === false) {
        props[key]["@xs:"] =val
        props[key][responsiveBreakPoints[currentIndex]] =val
      } else {
        //step 3
        let index = isSmallerPoints(Object.keys(props[key]) ?? {}) + 1
        props[key] = { ...props[key], [responsiveBreakPoints[index]]: val }
      }
      props=props
      console.log({ props })
    } 
  }
  function xy(prop, klas = prop,) {
    if (!props[prop]) return
    for (const b in props[prop]) {
      value += ` ${b}${klas}-${props[prop][b]}`
    }
  }
  function xyz(prop, klas = prop,) {
    if (!props[prop]) return
    for (const b in props[prop]) {
      value += ` ${b}${klas}-[${props[prop][b]}]`
    }
  }
  function set(key: string, val: string) {
    updateProps(key, val)
    console.log('set: ', props, key, val)
    value = ''

    if (props.flexDirection) {
      for (const b in props.flexDirection) {
       value += ` ${b}flex ${b}flex-${props.flexDirection[b]}`
      }
      
    }
    xy('flex')

    // if (props.flex) {
    //   for (const b in props.flex) {
    //     value += `${b}flex ${b}flex-${props.flex[b]}`
    //   }
    // }

    xy('items', 'items')
    // if (props.items) {
    //   value += ` items-` + props.items
    // }

    xy('justify', 'justify')
    // if (props.justify) {
    //   value += ` justify-` + props.justify
    // }

    xy('bg')
    // if (props.bg) {
    //   for (const b in props.bg){
    //     value += ` ${b}bg-${props.bg[b]}`
    //   }
    // }

    xy('textColor', 'text')
    // if (props.textColor) {
    //   for (const b in props.textColor){
    //     value += ` ${b}text-${props.textColor[b]}`
    //   }
    // }

    xy('fontSize', 'text')
    // if (props.fontSize) {
    //   for (const b in props.fontSize){
    //     value += ` ${b}text-${props.fontSize[b]}`
    //   }
    // }

    xy('w')
    // if (props.width) {
    //   for (const b in props.width){
    //     value += ` ${b}w-[${props.width[b]}]`
    //   }
    // }

    // hight .......................
    xy('h')
    // if (props.height) {
    //   value += ` h-[` + props.height + ']'
    // }

    xyz('pt')
    // if (props.topPadding) {
    //   value += ` pt-[` + props.topPadding + ']'
    // }

    xyz('pl')
    // if (props.leftPadding) {
    //   value += ` pl-[` + props.leftPadding + ']'
    // }

    xyz('pb')
    // if (props.bottomPadding) {
    //   value += ` pb-[` + props.bottomPadding + ']'
    // }

    xyz('pr')
    // if (props.rightPadding) {
    //   value += ` pr-[` + props.rightPadding + ']'
    // }

    // margin sizing ....................................................

    xyz('mt')
    // if (props.topMargin) {
    //   value += ` mt-[` + props.topMargin + ']'
    // }

    xyz('ml')
    // if (props.leftMargin) {
    //   value += ` ml-[` + props.leftMargin + ']'
    // }

    xyz('mb')
    // if (props.bottomMargin) {
    //   value += ` mb-[` + props.bottomMargin + ']'
    // }

    xyz('mr')
    // if (props.rightMargin) {
    //   value += ` mr-[` + props.rightMargin + ']'
    // }

    value += ' __ '

    if (props.Class) {
      value += props.Class
    }
    value = value
    console.log('value', value)
  }

  let sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']
</script>

<El row>
  <!--class ------------------------------------->
  <FormInput
    label="Class"
    bind:value={props.Class}
    on:change={(e) => set('Class', e.target.value)} />
  <Accordions>
    <StyleAccordion title="Size">
      <!--font size---------------------------------------->
      <FormSelect
        placeholder={props.fontSize ? props.fontSize[responsiveMode] : 'choose a size'}
        items={sizes}
        label="Font size"
        on:change={(e) => set('fontSize', e.target.value)}
        let:item>
        <El>{item}</El>
      </FormSelect>

      <FormField label="Sizes">
        <FormSlider
          attribute="Width"
          value={props.w ? props.w[responsiveMode] : ''}
          on:change={(e) => set('w', e.detail)} />

        <FormSlider
          attribute="Hight"
          value={props.h ? props.h[responsiveMode] : ''}
          on:change={(e) => set('h', e.detail)} />

        <El class="flex items-center gap-2 mt-3">
          <!--padding sizing .............................................-->
          <button
            class="w-full bg-gray-200 border border-gray-300 hover:bg-gray-300 font-bold py-2 px-4 rounded"
            >Padding</button>
          <Popover trigger="click">
            <PopoverBody>
              <FormSlider
                attribute="Top"
                value={props.pt ? props.pt[responsiveMode] : ''}
                on:change={(e) => set('pt', e.detail)} />
              <FormSlider
                attribute="Left"
                value={props.pl ? props.pl[responsiveMode] : ''}
                on:change={(e) => set('pl', e.detail)} />
              <FormSlider
                attribute="bottom"
                value={props.pb ? props.pb[responsiveMode] : ''}
                on:change={(e) => set('pb', e.detail)} />
              <FormSlider
                attribute="Right"
                value={props.pr ? props.pr[responsiveMode] : ''}
                on:change={(e) => set('pr', e.detail)} />
            </PopoverBody>
          </Popover>

          <!--margin sizing .............................................-->

          <button
            class="w-full bg-gray-200 border border-gray-300 hover:bg-gray-300 font-bold py-2 px-4 rounded"
            >Margin</button>
          <Popover trigger="click">
            <PopoverBody>
              <FormSlider
                negative={true}
                attribute="Top"
                value={props.mt ? props.mt[responsiveMode] : ''}
                on:change={(e) => set('mt', e.detail)} />
              <FormSlider
                negative={true}
                attribute="Left"
                value={props.ml ? props.ml[responsiveMode] : ''}
                on:change={(e) => set('ml', e.detail)} />
              <FormSlider
                negative={true}
                attribute="bottom"
                value={props.mb ? props.mb[responsiveMode] : ''}
                on:change={(e) => set('mb', e.detail)} />
              <FormSlider
                negative={true}
                attribute="Right"
                value={props.mr ? props.mr[responsiveMode] : ''}
                on:change={(e) => set('mr', e.detail)} />
            </PopoverBody>
          </Popover>
        </El>

        <!--font size---------------------------------------->
        <FormSelect
          placeholder={props.fontSize ? props.fontSize[responsiveMode] : 'choose a size'}
          items={sizes}
          label="Font size"
          value={props.fontSize ? props.fontSize[responsiveMode] : ''}
          on:change={(e) => set('fontSize', e.detail)}
          let:item>
          <El>{item}</El>
        </FormSelect>
      </FormField>
    </StyleAccordion>

    <StyleAccordion title="Border">
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
    </StyleAccordion>
    <StyleAccordion title="Colors">
      <FormField label="Colors">
        <El class="flex gap-2">
          <button
            class="flex flex-1 items-center border border-gray-300 font-bold py-2 px-4 rounded bg-gray-200">
            <div
              class="w-4 h-4 me-2 border border-gray-300 bg-{props.bg
                ? props.bg[responsiveMode]
                : ''}">
            </div>
            Background
          </button>
          <Popover placement="bottom-start">
            <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
              {#each colors as color}
                <div class="p-[1px] w-1/10 hover:shadow-lg">
                  <div on:click={() => set('bg', color)} class="bg-{color} cursor-pointer h-4 w-4">
                  </div>
                </div>
              {/each}
              <div class="p-[1px] w-1/10 hover:shadow-lg">
                <div
                  on:click={() => set('bg', 'white')}
                  class="bg-{'white'} cursor-pointer h-4 w-4">
                </div>
              </div>
              <div class="p-[1px] w-1/10 hover:shadow-lg">
                <div
                  on:click={() => set('bg', 'black')}
                  class="bg-{'black'} cursor-pointer h-4 w-4">
                </div>
              </div>
            </PopoverBody>
          </Popover>

          <button
            class="flex flex-1 items-center border border-gray-300 font-bold py-2 px-4 rounded bg-gray-200">
            <div
              class="w-4 h-4 me-2 border border-gray-300 bg-{props.textColor
                ? props.textColor[responsiveMode]
                : ''}">
            </div>
            Text
          </button>
          <Popover placement="bottom-start">
            <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
              {#each colors as color}
                <div class="p-[1px] w-1/10 hover:shadow-lg">
                  <div
                    on:click={() => set('textColor', color)}
                    class="bg-{color} cursor-pointer h-4 w-4">
                  </div>
                </div>
              {/each}
              <div class="p-[1px] w-1/10 hover:shadow-lg">
                <div
                  on:click={() => set('textColor', 'white')}
                  class="bg-{'white'} cursor-pointer h-4 w-4">
                </div>
              </div>
              <div class="p-[1px] w-1/10 hover:shadow-lg">
                <div
                  on:click={() => set('textColor', 'black')}
                  class="bg-{'black'} cursor-pointer h-4 w-4">
                </div>
              </div>
            </PopoverBody>
          </Popover>
        </El>
      </FormField>
    </StyleAccordion>
    <StyleAccordion title="Display">
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
    </StyleAccordion>
  </Accordions>
</El>

<style>
  :global(.style-div .y-label) {
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  :global(.style-div .y-form-field) {
    font-weight: bold;
    margin-bottom: 12px;
  }
</style>
