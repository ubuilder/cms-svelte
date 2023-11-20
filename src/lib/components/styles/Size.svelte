<script>

  import { El, FormField, FormSelect, Popover, PopoverBody } from "yesvelte"
  import FormSlider from "../FormSlider.svelte"
  export let responsiveMode
  export let props
  export let set
  let sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']


</script>
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
        value={props.w[responsiveMode]}
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