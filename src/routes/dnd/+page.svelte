<script lang="ts">
	import { browser } from '$app/environment'
    import {DragDrop} from '$lib/helpers/drag-drop'
	import { onMount, tick } from 'svelte'

    let slots: string[] = []

    let dragging = false;

    const components = {
        'card': `<div class="card"><div data-parent="card" data-index="0" class="dropzone lg"></div></div>`,
        'button': `<button class="button">Button</button>`,
        'input': `<input class="input"></input>`
    }

    function onDrop({source, target}) {
        // target.parentElement.insertBefore(source.cloneNode(), target);
        const parent = target.dataset.parent
        const index = target.dataset.index

        console.log({parent, index})

        if(!parent) {
            slots = [...slots.slice(0, index), components[source.dataset.id], ...slots.slice(index)]
        } else {
            console.log('insert inside: ', parent)
        }
        // 
    }
    let instance: any;
    function bind() {
        if(browser) {

        instance = DragDrop(document.querySelector('.page'), {
        draggable: '.draggable',
        dropzone: '.dropzone'
    })

    instance.on('start', () => dragging = true)
    instance.on('return', () => dragging = false)
    instance.on('drop', (e) => {
        onDrop(e)
        dragging = false
    })
}

    }

    function unbind() {
        if(instance) {
            instance.destroy()
        }
    }

onMount(bind)

$: {
    slots;

    tick().then(() => {

        unbind()
        bind()
    })

}
</script>


<div class="page" class:dragging>

<div class="components">
    <div class="draggable" data-id="button">Button</div>
    <div class="draggable" data-id="card">Card</div>
    <div class="draggable" data-id="input">Input</div>


</div>

<div class="content">
    {#each slots as slot, index}
        <div data-parent="" data-index={index} class="dropzone"></div>
        <div class="draggable">
            {@html slot}
        </div>
    {/each}
    <div class="dropzone" data-parent="" data-index={slots.length}></div>

</div>
</div>

<style>
    .page {
        display: flex;
    }

.content {
    flex: 1;
    border: 1px solid blue;
}
.components {
    width: 200px;
    border: 1px solid red;
}

:global(.dropzone) {
    opacity: 0;
    height: 8px;
    background-color: green;
}

.dragging :global(.dropzone) {
    opacity: 0.2;
}

.dragging :global(.dropzone:hover) {
    opacity: 1;
}

:global(.button) {
    padding: 8px 16px;
    border: 1px solid gray;
    background-color: aquamarine;
}
:global(.card) {
    padding: 16px;
    border: 1px solid gray;
}

:global(.input) {
    padding: 8px 16px;
    border: 1px solid gray;
}


</style>

