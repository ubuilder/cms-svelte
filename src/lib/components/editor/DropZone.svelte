<script lang="ts">
	import DragDrop, { utilsFunction as uf} from './utils';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher()
	export let screenSize: string; 
	let dropzone: HTMLElement;
	const dragDrop = DragDrop();
	onMount(()=>{
		dragDrop.makeDropZone(dropzone, {
			onDragEnter: dragEnterHandler,
			onDragLeave: dragLeaveHandler,
			onDragOver: dragOverhandler,
			onDrop: dropHandler,
		})
		dragDrop.makeDragAbleSelector('.u-component')
		dragDrop.makeReiszeAbleSelector('.u-component')
		
	})
	function dragEnterHandler(e: MouseEvent): void {
		e.preventDefault();
	}
	function dropHandler(e: MouseEvent): void {
		e.preventDefault();
	}
	function dragLeaveHandler(e: MouseEvent): void {
		e.preventDefault();
	}
	function dragOverhandler(e: MouseEvent): void {
		e.preventDefault();
	}
	dragDrop.onInsert((e, {id, target, parent, slots, index})=>{
		insertHandler(e, {id,target,slots, parent, index});
	})
	dragDrop.onFocusIn((e: Event, {id, target, parent})=>{
		dispatch('componentFocusIn', {id,target, parent})
	})
	dragDrop.onFocusOut((e: Event, {})=>{
		dispatch('componentFocusOut')
	})
	dragDrop.onResize((event: Event, {id, target, parent, parentId, slots})=>{
		console.log('resize', id, target, parent, parentId, slots)
	})

	function insertHandler(e: ElementEventMap, {target, parent, index}) {
		if (target) {
			target.parentElement.querySelector('.u-slot')?.setAttribute('contenteditable', 'true')
		}
	}
</script>

<div
    bind:this={dropzone}
	class="drop-zone {screenSize == 'laptop'? 'laptop': screenSize == 'mobile'? 'mobile':'tablet'}"
	role="region"
>
	<slot />
</div>

<style>
	.drop-zone {
		border: 1px solid rgb(0, 119, 255);
		border-radius: 5px;
		grid-column-start: 2;
		grid-column-end: 3;
		min-height: 300px;
		height: max-content;
		padding: 5px;
		padding-bottom: 50px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 5px;
		width:  calc(100% - 5px);
		background-color: white;
		overflow-x: auto;
	}
	.laptop{		
		
	}
	.tablet{
		max-width: 900px;
		min-width: 500px;
	}
	.mobile{
		max-width: 500px;
		min-width: 300px;

	}
</style>
