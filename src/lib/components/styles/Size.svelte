<script>

  import { El, FormField, FormSelect, Popover, PopoverBody } from "yesvelte"
  import FormSlider from "../FormSlider.svelte"
  export let responsiveMode
  export let props
  export let set
  export let breakPoints= []
  export let getExactValue = ()=>{}
  let sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']


</script>
    <!--font size---------------------------------------->
    <FormSelect
      placeholder={getExactValue("fontSize")?? 'choose a size'}
      items={sizes}
      label="Font size"
      on:change={(e) => set('fontSize', e.target.value)}
      let:item>
      <El>{item}</El>
    </FormSelect>

    <FormField label="Sizes">
      <FormSlider
        attribute="Width"
        value={getExactValue("w")}
        on:change={(e) => set('w', e.detail)} />

      <FormSlider
        attribute="Hight"
        value={getExactValue("h")}
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
              value={getExactValue("pt")}
              on:change={(e) => set('pt', e.detail)} />
            <FormSlider
              attribute="Left"
              value={getExactValue('ps')}
              on:change={(e) => set('ps', e.detail)} />
            <FormSlider
              attribute="bottom"
              value={getExactValue("pb")}
              on:change={(e) => set('pb', e.detail)} />
            <FormSlider
              attribute="Right"
              value={getExactValue("pe")}
              on:change={(e) => set('pe', e.detail)} />
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
              value={getExactValue("mt")}
              on:change={(e) => set('mt', e.detail)} />
            <FormSlider
              negative={true}
              attribute="Left"
              value={getExactValue('ms')}
              on:change={(e) => set('ms', e.detail)} />
            <FormSlider
              negative={true}
              attribute="bottom"
              value={getExactValue('mb')}
              on:change={(e) => set('mb', e.detail)} />
            <FormSlider
              negative={true}
              attribute="Right"
              value={getExactValue("mr")}
              on:change={(e) => set('mr', e.detail)} />
          </PopoverBody>
        </Popover>
      </El>
    </FormField>