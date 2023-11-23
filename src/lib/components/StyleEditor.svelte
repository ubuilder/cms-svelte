<script lang="ts">
  import { onMount } from 'svelte'
  import { Accordions, El, FormInput } from 'yesvelte'
  import FormSlider from './FormSlider.svelte'
  import StyleAccordion from './StyleAccordion.svelte'
  import Display from './styles/Display.svelte'
  import Color from './styles/Color.svelte'
  import Border from './styles/Border.svelte'
  import Size from './styles/Size.svelte'

  export let value: string
  export let responsiveMode = '@xl:'

  let props: any = {}
  let breakPoints = ['@xs:', '@sm:', '@md:', '@lg:', '@xl:']

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
      klass.startsWith(`@lg:${value}-`) ||
      klass.startsWith(`@xl:${value}-`)
    ) {
      return true
    }
  }
  function extractResponsiveClasses(value, stile) {
    let res: Record<string, any> = {}
    value = value.trim().replace('[', '').replace(']', '')
    if (value.startsWith(`@xs:${stile}-`)) {
      res['@xs:'] = value.split(`@xs:${stile}-`)[1]
    } else if (value.startsWith(`@sm:${stile}-`)) {
      res['@sm:'] = value.split(`@sm:${stile}-`)[1]
    } else if (value.startsWith(`@md:${stile}-`)) {
      res['@md:'] = value.split(`@md:${stile}-`)[1]
    } else if (value.startsWith(`@lg:${stile}-`)) {
      res['@lg:'] = value.split(`@lg:${stile}-`)[1]
    } else if (value.startsWith(`@xl:${stile}-`)) {
      res['@xl:'] = value.split(`@xl:${stile}-`)[1]
    }
    return res
  }
  function initializeProps(){
    props.m = {}
    props.mt = {}
    props.ms = {}
    props.me = {}
    props.mb = {}

    props.b = {}
    props.bt = {}
    props.bb = {}
    props.bs = {}
    props.be = {}

    props.borderStyle = {}
    props.borderStyleT = {}
    props.borderStyleB = {}
    props.borderStyleS = {}
    props.borderStyleE = {}

    props.p = {}
    props.pt = {}
    props.pb = {}
    props.ps = {}
    props.pe = {}

    props.bg = {}

    props.textColor = {}
    props.fontSize = {}
    props.items = {}
    props.justify = {}
    props.flex = {}
    props.w = {}
    props.h = {}

    props.textColor = {}
    props.flexDirection = {}
    props.justify = {}
  }

  function parse(value: string = '') {
    initializeProps()
    const classes = value.split(' ')
    for (let index in classes) {
      let klass = classes[index]
      if (match(klass, 'bg')) {
        props.bg = { ...props.bg, ...extractResponsiveClasses(klass, 'bg') }
      } else if (match(klass, 'text')) {
        if (colorNames.includes(klass.split('-')[1])) {
          props.textColor = { ...props.textColor, ...extractResponsiveClasses(klass, 'text') }
        } else {
          props.fontSize = { ...props.fontSize, ...extractResponsiveClasses(klass, 'text') }
        }
      } else if (match(klass, 'items')) {
        props.items = { ...props.items, ...extractResponsiveClasses(klass, 'items') }
      } else if (match(klass, 'justify')) {
        props.justify = { ...props.justify, ...extractResponsiveClasses(klass, 'justify') }
      } else if (match(klass, 'flex')) {
        props.flex = { ...props.flex, ...extractResponsiveClasses(klass, 'flex') }
      } else if (match(klass, 'w')) {
        props.w = { ...props.w, ...extractResponsiveClasses(klass, 'w') }
      } else if (match(klass, 'h')) {
        props.h = { ...props.h, ...extractResponsiveClasses(klass, 'h') }
      }

      // padding sizing ......................................................
      else if (match(klass, 'p')) {
        props.p = { ...props.p, ...extractResponsiveClasses(klass, 'p') }
      } else if (match(klass, 'pt')) {
        props.pt = { ...props.pt, ...extractResponsiveClasses(klass, 'pt') }
      } else if (match(klass, 'ps')) {
        props.ps = { ...props.ps, ...extractResponsiveClasses(klass, 'ps') }
      } else if (match(klass, 'pb')) {
        props.pb = { ...props.pb, ...extractResponsiveClasses(klass, 'pb') }
      } else if (match(klass, 'pe')) {
        props.pe = { ...props.pe, ...extractResponsiveClasses(klass, 'pe') }
      }

      // margin sizing ......................................................
      else if (match(klass, 'mt')) {
        props.mt = { ...props.mt, ...extractResponsiveClasses(klass, 'mt') }
      } else if (match(klass, 'ms')) {
        props.ml = { ...props.ms, ...extractResponsiveClasses(klass, 'ms') }
      } else if (match(klass, 'mb')) {
        props.mb = { ...props.mb, ...extractResponsiveClasses(klass, 'mb') }
      } else if (match(klass, 'me')) {
        props.mr = { ...props.me, ...extractResponsiveClasses(klass, 'me') }
      } else if (match(klass, 'border')) {
        for (const style of ['solid', 'dotted', 'dashed', 'none']) {
          if (match(klass, `border-${style}`)) {
            props.borderStyle = {
              ...props.borderStyle,
              ...extractResponsiveClasses(klass, `border-${style}`),
            }
          }
        }
        for (const style of ['s-solid', 's-dotted', 's-dashed', 's-none']) {
          if (match(klass, `border-${style}`)) {
            props.borderStyleS = {
              ...props.borderStyleS,
              ...extractResponsiveClasses(klass, `border-${style}`),
            }
          }
        }
        for (const style of ['e-solid', 'e-dotted', 'e-dashed', 'e-none']) {
          if (match(klass, `border-${style}`)) {
            props.borderStyleE = {
              ...props.borderStyleE,
              ...extractResponsiveClasses(klass, `border-${style}`),
            }
          }
        }
        for (const style of ['t-solid', 't-dotted', 't-dashed', 't-none']) {
          if (match(klass, `border-${style}`)) {
            props.borderStyleT = {
              ...props.borderStyleT,
              ...extractResponsiveClasses(klass, `border-${style}`),
            }
          }
        }
        for (const style of ['b-solid', 'b-dotted', 'b-dashed', 'b-none']) {
          if (match(klass, `border-${style}`)) {
            props.borderStyleB = {
              ...props.borderStyleB,
              ...extractResponsiveClasses(klass, `border-${style}`),
            }
          }
        }
        for (const side of ['s', 'e', 't', 'b']) {
          if (match(klass, `border-${side}`)) {
            props[`b${side}`] = {
              ...props[`b${side}`],
              ...extractResponsiveClasses(klass, `border-${side}`),
            }
          }
        }
        if (match(klass, `border`)) {
          props.b = { ...props.b, ...extractResponsiveClasses(klass, `border`) }
        }
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
    console.log('parse: ', JSON.stringify(props))
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
    if (!props[key]) props[key] = {}

    //delete the responsive break point if no value is passed
    if (!val) delete props[key][responsiveMode]

    props[key][responsiveMode] = val
  }

  function set(key: string, val: string) {
    let _value = ''
    function xy(prop, klas = prop) {
      if (!props[prop]) return
      for (const b in props[prop]) {
        _value += ` ${b}${klas}-${props[prop][b]}`
      }
    }
    function xyz(prop, klas = prop) {
      if (!props[prop]) return
      for (const b in props[prop]) {
        _value += ` ${b}${klas}-[${props[prop][b]}]`
      }
    }
    if (key !== 'Class') {
      updateProps(key, val)
    }

    if (props.flexDirection) {
      for (const b in props.flexDirection) {
        _value += ` ${b}flex ${b}flex-${props.flexDirection[b]}`
      }
    }
    xy('flex')
    xy('flexDirection', 'flex')
    xy('items', 'items')
    xy('justify', 'justify')
    xy('bg')
    xy('textColor', 'text')
    xy('fontSize', 'text')
    xy('b', 'border')
    xy('bt', 'border-t')
    xy('bb', 'border-b')
    xy('bs', 'border-s')
    xy('be', 'border-e')
    xy('borderStyle', 'border')
    xy('borderStyleT', 'border-t')
    xy('borderStyleB', 'border-b')
    xy('borderStyleS', 'border-s')
    xy('borderStyleE', 'border-e')
    xyz('w')
    xyz('h')
    xyz('pt')
    xyz('ps')
    xyz('pb')
    xyz('pr')
    xyz('mt')
    xyz('ms')
    xyz('mb')
    xyz('mr')
    _value += ' __ '

    if (props.Class) {
      _value += props.Class
    }
    value = _value
    console.log('value:', value)
  }

  /**
  *this function return the value of style at current responsive break point if 
  the current break point is null then the higher break point value is retured
  *  */
  function getExactValue(key) {
    for (let x of breakPoints.slice(breakPoints.indexOf(responsiveMode))) {
      console.log('key: ', key)
      if (props[key][x]) {
        return props[key][x]
      }
    }
    return ''
  }
</script>

<El row>
  <!--class ------------------------------------->
  <FormInput
    label="Class"
    bind:value={props.Class}
    on:change={(e) => set('Class', e.target.value)} />
  <Accordions>
    {#key responsiveMode}
      <StyleAccordion title="Size">
        <Size {breakPoints} {responsiveMode} bind:props {set} {getExactValue} />
      </StyleAccordion>
      <StyleAccordion title="Border">
        <Border {responsiveMode} bind:props {set} {getExactValue} />
      </StyleAccordion>
      <StyleAccordion title="Colors">
        <Color {responsiveMode} bind:props {set} {colors} {getExactValue} />
      </StyleAccordion>
      <StyleAccordion title="Display">
        <Display {responsiveMode} bind:props {set} {getExactValue} />
      </StyleAccordion>
    {/key}
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
