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
    PopoverHeader,
    Tooltip,
  } from 'yesvelte'
  import FormSlider from './FormSlider.svelte'
  import StyleAccordion from './StyleAccordion.svelte'

  export let value: string
  let _value:string
  export let responsiveMode = ''
  $:{console.log("responsive",responsiveMode)}

  let props: any = {}
  let responsiveBreakPoints = ["", "sm:", "md:", "lg:", "xl:"]
  function match(klass, value){
    // let classlist = [
    //   "bg", "text",
    //    "b" ,"bt", 'bs', 'be', 'bb',
    //    "m", 'mt' , "ms", 'me' , "mb",
    //    "p", 'pt' , "ps", 'pe' , "pb",
    //    "p", 'pt' , "ps", 'pe' , "pb",
    //    "w", "h",
    // ]

    if(klass.startsWith(`${value}-`) || klass.startsWith(`sm:${value}-`) || klass.startsWith(`md:${value}-`) || klass.startsWith(`lg:${value}-`)){
      return true
    }
  }
  function extractResponsiveClasses(value, stile){
    let res = {}
    value =value.trim()
    if(value.startsWith(`${stile}-`)){
      res[""] = value.split(`${stile}-`)[1]
    } else if(value.startsWith(`sm:${stile}-`) ){
      res["sm:"] = value.split(`sm:${stile}-`)[1]
    }else if(value.startsWith(`md:${stile}-`) ){
      res["md:"] = value.split(`md:${stile}-`)[1]
    }else if(value.startsWith(`lg:${stile}-`) ){
      res["lg:"] = value.split(`lg:${stile}-`)[1]
    }
    return res
  }
  

  function parse(value: string = '') {
    const classes = value.split(' ')
    for (let index in classes) {
      let klass = classes[index]
      if (match(klass , "bg")) {
        props.bg = {...props.bg, ...extractResponsiveClasses(klass, "bg")}
      }
      if (match(klass, 'text')) {
        if (colorNames.includes(klass.split('-')[1])) {
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
        props.topPadding = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('pl-[')) {
        props.leftPadding = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('pb-[')) {
        props.bottomPadding = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('pr-[')) {
        props.rightPadding = klass.substring(4, klass.length - 1)
      }

      // margin sizing ......................................................
      if (klass.startsWith('mt-[')) {
        props.topMargin = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('ml-[')) {
        props.leftMargin = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('mb-[')) {
        props.bottomMargin = klass.substring(4, klass.length - 1)
      }

      if (klass.startsWith('mr-[')) {
        props.rightMargin = klass.substring(4, klass.length - 1)
      }

      props.borderSides = {
        top: false,
        right: true,
        bottom: false,
        left: false,
      }

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

  function set(_props: any, key:string, val:string) {
    console.log({key, val})
    console.log({props})
    const currentIndex = responsiveBreakPoints.findIndex((x)=> x == responsiveMode)
    function isSmallerPoints(prop){
        console.log('reverse:', prop.reverse())
        for (let x of prop.reverse()){
          const index = responsiveBreakPoints.slice(0, currentIndex).findIndex((y)=>{
            if(x==y){
              return true
            }
          })
          if(index !== -1)return index
        }
        return false
      }
    if(key){
      ///check if there is smaller break point added before
      ///if not the set default stlyle to current + 1 and set the current style to default 
      ///if yes exits then set the current styl to previous style + 1 
      //{
        // "":"red-500",
        // "lg":"green-500",
      // }
      console.log({currentIndex})
     

     
      
      if(isSmallerPoints(Object.keys(props[key]??{}))){
        console.log(1)

        props[key] = {
          [responsiveMode]: val
        }
      }else if(responsiveMode == '' && Object.keys(props[key]??{}).includes('')){

        props[key][""]  = val
      }else if(Object.keys(props[key]??{}).includes('')){
        console.log(2)
        
        const defaultt = props[key][responsiveBreakPoints[0]]

        props[key][responsiveBreakPoints[currentIndex + 1]] = defaultt
        props[key][responsiveBreakPoints[0]] = val
      }else{
        let index = 0
        if(isSmallerPoints(Object.keys(props)??{})){
          index = isSmallerPoints(Object.keys(props)??{}) + 1
        }
        props[key] = {...props[key], [responsiveBreakPoints[index]] :val }
      }
      console.log({props})
    }else{
      props = { ...props, ..._props }

    }
    
    console.log('set: ', props, _props)
    value = ''
   
    if(props.flexDirection){
      responsiveMode

    }
    if (props.flexDirection) {
      value += 'flex flex-' + props.flexDirection
    }

    if (props.items) {
      value += ` items-` + props.items
    }

    if (props.justify) {
      value += ` justify-` + props.justify
    }

    if (props.bg) {
      for (const b in props.bg){
        value += ` ${b}bg-${props.bg[b]}`
        console.log('b:', b, responsiveMode)
        responsiveBreakPoints.slice(0, currentIndex).map(x=>{
          if(x==b){
            value += ` xs:bg-${props.bg[b]}`
          }
        })
      }
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
    value = value
    console.log("value", value)

  }




  let sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']
</script>

<El row>
  <!--class ------------------------------------->
  <FormInput
    label="Class"
    bind:value={props.Class}
    on:change={(e) => set({ Class: e.target.value })} />
  <Accordions>
    <StyleAccordion title="Size">
      <!--font size---------------------------------------->
      <FormSelect
        placeholder={props.fontSize ?? 'choose a size'}
        items={sizes}
        label="Font size"
        bind:value={props.fontSize}
        on:change={(e) => set({ fontSize: e.target.value })}
        let:item>
        <El>{item}</El>
      </FormSelect>

      <FormField label="Sizes">
        <FormSlider
          attribute="Width"
          value={props.width}
          on:change={(e) => set({ width: e.detail })} />

        <FormSlider
          attribute="Hight"
          value={props.height}
          on:change={(e) => set({ height: e.detail })} />

        <El class="flex items-center gap-2 mt-3">
          <!--padding sizing .............................................-->
          <button
            class="w-full bg-gray-200 border border-gray-300 hover:bg-gray-300 font-bold py-2 px-4 rounded"
            >Padding</button>
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

          <button
            class="w-full bg-gray-200 border border-gray-300 hover:bg-gray-300 font-bold py-2 px-4 rounded"
            >Margin</button>
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
        </El>

        <!--font size---------------------------------------->
        <FormSelect
          placeholder={props.fontSize ?? 'choose a size'}
          items={sizes}
          label="Font size"
          bind:value={props.fontSize}
          on:change={(e) => set({ fontSize: e.target.value })}
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
              class:text-white={props.borderSides['top']}
              class:!bg-blue-500={props.borderSides['top']}
              on:click={() => set({ borderSides: { top: !props.borderSides['top'] } })}>1</button>
            <button
              class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['right']}
              class:!bg-blue-500={props.borderSides['right']}
              on:click={() => set({ borderSides: { right: !props.borderSides['right'] } })}
              >2</button>
            <button
              class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['bottom']}
              class:!bg-blue-500={props.borderSides['bottom']}
              on:click={() => set({ borderSides: { bottom: !props.borderSides['bottom'] } })}
              >4</button>
            <button
              class="p-1 flex items-center justify-center w-6 h-6 rounded-r inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['left']}
              class:!bg-blue-500={props.borderSides['left']}
              on:click={() => set({ borderSides: { left: !props.borderSides['left'] } })}>8</button>
          </div>
        </El>

        <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
          <div class="font-bold">Style:</div>
          <div class="flex gap-1">
            {#each ['solid', 'dotted', 'dashed', 'none'] as style}
              <button
                class="p-1 flex items-center justify-center w-6 h-6 rounded inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
                class:text-white={props.borderStyle === style}
                class:!bg-blue-500={props.borderStyle === style}
                on:click={() => set({ borderStyle: style })}><Icon name="circle-{style}" /></button>
            {/each}
          </div>
        </El>

        <El mb="3" w="100" d="flex" justifyContent="between" alignItems="center">
          <div class="font-bold">Sides:</div>
          <div class="flex gap-1">
            <button
              class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['top']}
              class:!bg-blue-500={props.borderSides['top']}
              on:click={() => set({ borderSides: { top: !props.borderSides['top'] } })}
              ><Icon mb="2" name="border-top" /></button>
            <button
              class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['right']}
              class:!bg-blue-500={props.borderSides['right']}
              on:click={() => set({ borderSides: { right: !props.borderSides['right'] } })}
              ><Icon mb="2" name="border-right" /></button>
            <button
              class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['bottom']}
              class:!bg-blue-500={props.borderSides['bottom']}
              on:click={() => set({ borderSides: { bottom: !props.borderSides['bottom'] } })}
              ><Icon mb="2" name="border-bottom" /></button>
            <button
              class="p-1 rounded flex items-center justify-center w-6 h-6 inline-flex border border-gray-300 text-black bg-gray-100 hover:bg-gray-200"
              class:text-white={props.borderSides['left']}
              class:!bg-blue-500={props.borderSides['left']}
              on:click={() => set({ borderSides: { left: !props.borderSides['left'] } })}
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
            <div class="w-4 h-4 me-2 border border-gray-300 bg-{props.bgColor}"></div>
            Background
          </button>
          <Popover placement="bottom-start">
            <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">
              {#each colors as color}
                <div class="p-[1px] w-1/10 hover:shadow-lg">
                  <div
                    on:click={() => set({},"bg", color)}
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

          <button
            class="flex flex-1 items-center border border-gray-300 font-bold py-2 px-4 rounded bg-gray-200">
            <div class="w-4 h-4 me-2 border border-gray-300 bg-{props.textColor}"></div>
            Text
          </button>
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
        </El>
      </FormField>
    </StyleAccordion>
    <StyleAccordion title="Display">
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
            on:click={() => set({ items: 'center' })}
            ><Icon size="sm" name="arrow-bottom" /></button>
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
            on:click={() => set({ justify: 'start' })}
            ><Icon size="sm" name="arrow-right" /></button>
          <button
            class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
            class:!bg-blue-500={props.justify === 'center'}
            class:text-white={props.justify === 'center'}
            on:click={() => set({ justify: 'center' })}
            ><Icon size="sm" name="arrow-bottom" /></button>
          <button
            class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
            class:!bg-blue-500={props.justify === 'end'}
            class:text-white={props.justify === 'end'}
            on:click={() => set({ justify: 'end' })}><Icon size="sm" name="arrow-left" /></button>
          <button
            class="flex-1 p-1 rounded mx-0.5 bg-gray-100"
            class:!bg-blue-500={props.justify === 'between'}
            class:text-white={props.justify === 'stretch'}
            on:click={() => set({ justify: 'between' })}
            ><Icon size="sm" name="arrow-top" /></button>
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
