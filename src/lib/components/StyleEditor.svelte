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
  let responsiveBreakPoints = ['@xs:', '@sm:', '@md:', '@lg:', '@xl:', '#:']
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
      klass.startsWith(`@xl:${value}-`) ||
      klass.startsWith(`#:${value}-`)
    ) {
      return true
    }
  }
  function extractResponsiveClasses(value, stile) {
    let res = {}
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
    } else if (value.startsWith(`#:${stile}-`)) {
      res['#:'] = value.split(`#:${stile}-`)[1]
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
      } else if (match(klass, 'ml')) {
        props.ml = { ...props.ml, ...extractResponsiveClasses(klass, 'ml') }
      } else if (match(klass, 'mb')) {
        props.mb = { ...props.mb, ...extractResponsiveClasses(klass, 'mb') }
      } else if (match(klass, 'mr')) {
        props.mr = { ...props.mr, ...extractResponsiveClasses(klass, 'mr') }
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
    let currentIndex = responsiveBreakPoints.findIndex((x) => x == responsiveMode)
    console.log('currentIndxex: ', currentIndex)
    if (responsiveMode == '@xs:') currentIndex = 4
    function isSmallerPoints(prop) {
      let sortedKey = Object.keys(prop)
      sortedKey = sortedKey.sort(
        (a, b) => responsiveBreakPoints.indexOf(b) - responsiveBreakPoints.indexOf(a)
      )
      const inn = responsiveBreakPoints.slice(1, currentIndex)
      for (let x of sortedKey) {
        const index = inn.indexOf(x)
        if (index > -1) return index + 1
      }
      return false
    }
    if (key) {
      ///check if there is smaller break point added before
      ///if not the set default stlyle to current + 1 and set the current style to default
      ///if yes exits then set the current styl to previous style + 1

      //step 1
      console.log({ responsiveMode })
      props[key][responsiveMode] = val
      
      const pointer = props[key]['#:']?? ''
      //the case for upper levels
      let upper = false
      for (let x of responsiveBreakPoints.slice(responsiveBreakPoints.indexOf(responsiveMode)  + 1, 5)){
        if(props[key][x]){
          if(!pointer || pointer ==='undefined'){
            props[key]["#:"] = responsiveMode
          }
          if( props[key]["#:"] !== x){
            console.log('lslssslllll`')
            if(responsiveBreakPoints.indexOf(props[key]["#:"]) <= responsiveBreakPoints.indexOf(responsiveMode)){
              props[key]["#:"] = responsiveMode
            }
            props[key][responsiveBreakPoints[responsiveBreakPoints.indexOf(responsiveMode) + 1]] = props[key][x]
            upper = true
            break;
          }
        }
      }
      // if(!upper)



      let smaller  = false
      //the case of smaller
        for (let x of responsiveBreakPoints.slice(1, responsiveBreakPoints.indexOf(responsiveMode)).reverse()){
          console.log('xx---',  x)
          console.log("{pointer}", pointer)
            if(props[key][x]){
              console.log('xx--------------====')
              if(x == responsiveBreakPoints[responsiveBreakPoints.indexOf(props[key]["#:"]) + 1]){
                props[key][x] = val
                smaller = true
                console.log('1', x)
                break
              }else{
              // if(x !== responsiveBreakPoints[responsiveBreakPoints.indexOf(props[key]["#:"]) + 1]){
                props[key][responsiveBreakPoints[responsiveBreakPoints.indexOf(x) + 1]] = val
                smaller = true
                break
              }
            }
        }
        if(!smaller){
          console.log(2)

          props[key]["@xs:"] = val
        }


      // if(upper){
      //   //set is to current + 1
      //   // and set the pointer to current
      // }


      //check is smaller points
      // let isSmaller = false
      // for (let x of responsiveBreakPoints.slice(1, responsiveBreakPoints.indexOf(responsiveMode))) {
      //   if (props[key][x]) {
      //     isSmaller = true
      //   }
      // }
      // if (!isSmaller) {
      //   props[key]['@xs:'] = val
      // }
      
      // if(isSmaller){
      //   if (pointer && responsiveBreakPoints.indexOf(pointer) <= responsiveBreakPoints.indexOf(responsiveMode)) {
      //   console.log(2)
      //   for (let x of responsiveBreakPoints.slice(responsiveBreakPoints.indexOf(pointer) + 2, 5)) {
      //     console.log("x--",  x)
      //     if (x) {
      //       props[key][responsiveBreakPoints[responsiveBreakPoints.indexOf(pointer) + 1]] =
      //         props[key][x]
      //       break
      //     }
      //   }

      // }
      // }

      console.log("pointer",`${pointer}`)
      

      // if( responsiveBreakPoints.indexOf(responsiveMode)  >= responsiveBreakPoints.indexOf(pointer)){
      //   props[key]['#:'] = responsiveMode
      // }

      //replace the pointer
      

      


      // console.log({ pointer }, { pointerValue })
      // if(!pointer && responsiveMode !== "@xl:"){
      //   console.log(3)
      //   props[key]["#:"] = `${props[key]["@xs:"]}__${responsiveMode}`
      //   props[key][(responsiveBreakPoints[responsiveBreakPoints.indexOf(responsiveMode) + 1])]= props[key]["@xs:"]
      // }
      // if(!pointer){
      //   console.log(1)
      //   props[key]['@xs:'] = val
      // }
      // // if(pointer && responsiveBreakPoints.slice(/, responsiveMode))
      // let flug  = true
      // for (let x  of responsiveBreakPoints.slice(1, responsiveBreakPoints.indexOf(responsiveMode))){
      //   if(props[key][x]){
      //     flug = false
      //     break;
      //   }
      // }
      // if(flug){
      //   props[key]["@xs"] = val
      // }

      // for (let x  of responsiveBreakPoints.slice(responsiveBreakPoints.indexOf(pointer) +  1, 5)){
      //   console.log('xx', x)
      //   if(props[key][x] && x !== responsiveBreakPoints[responsiveBreakPoints.indexOf(pointer)  + 1]){
      //     console.log(3, x)
      //     pointerValue  =   props[key][x]
      //     break;
      //   }
      // }
      // // if(pointer === responsiveMode){
      // //   pointerValue = val
      // // }

      // if(responsiveMode !== '@xl:'){
      //   props[key]["#:"] = `${pointerValue}__${responsiveMode}`
      // }

      // if(res == responsiveMode){

      // }
      // if(res!=='@xl:'){
      //     props[key][responsiveBreakPoints[responsiveBreakPoints.findIndex(res) + 1]]= val
      // }
      // //step 2
      // if (isSmallerPoints(props[key] ?? {}) === false) {
      //   console.log(1)
      //   props[key]['@xs:'] = val
      // } else {
      //   //4
      //   console.log(2)
      //   //step 3
      //   let index = isSmallerPoints(props[key] ?? {})
      //   // props[key][responsiveBreakPoints[currentIndex + 1]] = val
      //   console.log('index', index + 1)

      // }

      props = props
      console.log({ props })
    }
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
    updateProps(key, val)
    console.log('set: ', props, key, val)

    if (props.flexDirection) {
      for (const b in props.flexDirection) {
        _value += ` ${b}flex ${b}flex-${props.flexDirection[b]}`
      }
    }
    xy('flex')
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
    xyz('pl')
    xyz('pb')
    xyz('pr')
    xyz('mt')
    xyz('ml')
    xyz('mb')
    xyz('mr')
    _value += ' __ '

    if (props.Class) {
      _value += props.Class
    }
    console.log('_value:', _value)
    console.log('value:', value)
    value = _value
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
      <Size {responsiveMode} bind:props {set} />
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
