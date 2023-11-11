<script lang="ts">
  import { onMount } from "svelte"
  import { Button, Dropdown, DropdownItem, DropdownMenu, El, FormField, FormInput, Icon, Popover, PopoverBody, PopoverHeader, Tooltip } from "yesvelte"

    
    export let value: string;

    let props: any = {}

    function parse(value: string = '') {
        const classes = value.split(' ')

for(let index in classes) {
    let klass = classes[index]
    if(klass.startsWith('bg-')) {
        props.bgColor = klass.substring(3);
    }

    if(klass.startsWith('text-')) {
        props.textColor = klass.substring(5);
    }

    if(klass.startsWith('items-')) {
        props.items = klass.substring(6);
    }
    if(klass.startsWith('justify-')) {
        props.justify = klass.substring(8);
    }
    if(klass.startsWith('flex-')) {
        props.flexDirection = klass.substring(5)
    }
    if(klass == '__') {
        props.Class = classes.slice(+index + 1).join(' ');
        break
    }
    
}

    }

    $: parse(value)

    let colorNames = ['red', 'green', 'blue', 'yellow', 'orange', 'sky', 'emerald', 'teal', 'pink', 'violet', 'indigo', 'amber', "gray"]
    let colorVariants = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
    $: colors = colorNames.map(name => colorVariants.map(variant => `${name}-${variant}`)).flat()
    
    
    function set(_props: any) {
        props = {...props, ..._props}
        console.log('set: ', props, _props)
        value = ""
        if(props.flexDirection) {
            value += 'flex flex-' + props.flexDirection
        }

        if(props.items) {
            value += ` items-` + props.items
        }
        if(props.justify) {
            value += ` justify-` + props.justify
        }

        if(props.bgColor) {
            value += ` bg-` + props.bgColor
        }
        if(props.textColor) {
            value += ` text-` + props.textColor
        }

        value += ' __ '
        if(props.Class) {
            value += props.Class
        }
    }
    

</script>

<El row>
    <FormInput label="Class" bind:value={props.Class} on:change={(e) => set({Class: e.target.value})} />
    {value}
    <FormField label="Colors">
        <div class="flex flex-row gap-2">
            <button class="flex-1 border border-gray-200 py-2 px-4 bg-gray-200 !bg-{props.bgColor}">Background</button>
                <Popover placement="bottom-start">
                    <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">    
                        {#each colors as color}
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({bgColor: color})} class="bg-{color} cursor-pointer h-4 w-4"></div>
                        </div>
                        {/each}
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({bgColor: "white"})} class="bg-{"white"} cursor-pointer h-4 w-4"></div>
                        </div>
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({bgColor: "black"})} class="bg-{"black"} cursor-pointer h-4 w-4"></div>
                        </div>
                    </PopoverBody>
                </Popover>    
            
                <button  class="flex-1 border border-gray-200 py-2 px-4 bg-gray-200 !bg-{props.textColor}">Text</button>
                <Popover placement="bottom-start">
                    <PopoverBody class="max-w-[190px] !p-1 flex flex-wrap -mx-1">    
                        {#each colors as color}
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({textColor: color})} class="bg-{color} cursor-pointer h-4 w-4"></div>
                        </div>
                        {/each}
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({textColor: "white"})} class="bg-{"white"} cursor-pointer h-4 w-4"></div>
                        </div>
                        <div class="p-[1px] w-1/10 hover:shadow-lg">
                            <div on:click={() => set({textColor: "black"})} class="bg-{"black"} cursor-pointer h-4 w-4"></div>
                        </div>

                    </PopoverBody>
                </Popover>    
            </div>
    </FormField>
    
    <FormField label="Flex Direction">
        <div class="flex">
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.flexDirection === 'row'} class:text-white={props.flexDirection === 'row'} on:click={() => set({flexDirection: 'row'})}><Icon size="sm" name="arrow-right"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.flexDirection === 'col'} class:text-white={props.flexDirection === 'col'} on:click={() => set({flexDirection: 'col'})}><Icon size="sm" name="arrow-bottom"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.flexDirection === 'row-reverse'} class:text-white={props.flexDirection === 'row-reverse'} on:click={() => set({flexDirection: 'row-reverse'})}><Icon size="sm" name="arrow-left"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.flexDirection === 'col-reverse'} class:text-white={props.flexDirection === 'col-reverse'} on:click={() => set({flexDirection: 'col-reverse'})}><Icon size="sm" name="arrow-top"/></button>
        </div>
    </FormField>

    <FormField label="Align Items">
        <div class="flex">
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.items === 'start'} class:text-white={props.items === 'start'} on:click={() => set({items: 'start'})}><Icon size="sm" name="arrow-right"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.items === 'center'} class:text-white={props.items === 'center'} on:click={() => set({items: 'center'})}><Icon size="sm" name="arrow-bottom"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.items === 'end'} class:text-white={props.items === 'end'} on:click={() => set({items: 'end'})}><Icon size="sm" name="arrow-left"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.items === 'stretch'} class:text-white={props.items === 'stretch'} on:click={() => set({items: 'stretch'})}><Icon size="sm" name="arrow-top"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.items === 'baseline'} class:text-white={props.items === 'stretch'} on:click={() => set({items: 'baseline'})}><Icon size="sm" name="arrow-top"/></button>
        </div>
    </FormField>
    <FormField label="Justify Content">
        <div class="flex">
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'start'} class:text-white={props.justify === 'start'} on:click={() => set({justify: 'start'})}><Icon size="sm" name="arrow-right"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'center'} class:text-white={props.justify === 'center'} on:click={() => set({justify: 'center'})}><Icon size="sm" name="arrow-bottom"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'end'} class:text-white={props.justify === 'end'} on:click={() => set({justify: 'end'})}><Icon size="sm" name="arrow-left"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'between'} class:text-white={props.justify === 'stretch'} on:click={() => set({justify: 'between'})}><Icon size="sm" name="arrow-top"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'evenly'} class:text-white={props.justify === 'stretch'} on:click={() => set({justify: 'evenly'})}><Icon size="sm" name="arrow-top"/></button>
            <button class="flex-1 p-1 rounded mx-0.5 bg-gray-100" class:!bg-blue-500={props.justify === 'around'} class:text-white={props.justify === 'stretch'} on:click={() => set({justify: 'around'})}><Icon size="sm" name="arrow-top"/></button>
        </div>
    </FormField>


    Margin
    Padding
    width
    height

    font size
    font weight

    
</El>
