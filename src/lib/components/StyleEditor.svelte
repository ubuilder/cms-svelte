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
  import Display from './styles/Display.svelte'
  import Color from './styles/Color.svelte'
  import Border from './styles/Border.svelte'
  import Size from './styles/Size.svelte'

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
    xy('items', 'items')
    xy('justify', 'justify')
    xy('bg')
    xy('textColor', 'text')
    xy('fontSize', 'text')
    xy('w')
    xy('h')
    xyz('pt')
    xyz('pl')
    xyz('pb')
    xyz('pr')
    xyz('mt')
    xyz('ml')
    xyz('mb')
    xyz('mr')
    value += ' __ '

    if (props.Class) {
      value += props.Class
    }
    value = value
    console.log('value', value)
  }

  
</script>

<El row>
  <!--class ------------------------------------->
  <FormInput
    label="Class"
    bind:value={props.Class}
    on:change={(e) => set('Class', e.target.value)} />
  <Accordions>
    <StyleAccordion title="Size">
      <Size  {responsiveMode} bind:props {set} />
    </StyleAccordion>
    <StyleAccordion title="Border">
      <Border {responsiveMode} bind:props {set} />
    </StyleAccordion>
    <StyleAccordion title="Colors">
      <Color {responsiveMode} bind:props {set} {colors} />
    </StyleAccordion>
    <StyleAccordion title="Display">
      <Display {responsiveMode} bind:props {set} />
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
