<script lang="ts">
	import ComponentProp from '$lib/ui/ComponentProp.svelte'
	import { customAlphabet } from 'nanoid'
	import hbs from 'handlebars'
	import '@ulibs/yesvelte/styles.css'
	import { onMount, tick } from 'svelte'
	import {
		Button,
		Card,
		El,
		FormInput,
		Icon,
		ModalProvider,
		Offcanvas,
		OffcanvasBody,
		TabContent,
		TabItem,
		TabList,
		TabPanel,
		Tabs,
		modal,
	} from '@ulibs/yesvelte'
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import AddComponentModal from '$lib/components/components/AddComponentModal.svelte'
	import interact from 'interactjs'
	import { browser } from '$app/environment'
	import SlotSidebarItem from './SlotSidebarItem.svelte'

	export let components: any[] = []
	export let type = 'page'

	export let page: any = {}
	export let component: any = {}

	$: slots = type === 'page' ? page.slot : (type === 'component' ? component.slot : [])

	let activeComponent: any = null
	let activeSlot: any = null

	let newComponentPosition: string | null = null
	let newComponentPositionField: any = null
	let newComponentPositionIndex: any = null

	let mode = 'options'
	let contentEl: any

	let borderPosition: any = {}
	let hoverBorderPosition: any = {}

	let dragging = false

	let props = {}

	function nanoid() {
		return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
	}

	function getId() {
		return nanoid()()
	}

	const hbsTemplates: any = {}

	const placeholder = (parent: string, field: string = '', index: number = 0, className = '') =>
		`<span class="placeholder ${className}" data-parent="${parent}" data-index="${index}" data-field="${field}"></span>`

	let html = ''

	let offcanvasOpen = false

	function render(slot = null) {
		if (slot) {
			console.log(`render(${slot.id})`)

			if (browser) {
				const a = document.querySelector(`[id="component-${slot.id}"]`)
				if (a) {
					a.outerHTML = renderSlot(slot, '', '', 0, false) // without placeholder
				}
			}
		} else {
			console.log('render()')
			html =
				slots.map((x, i) => renderSlot(x, '', '', i)).join('') + placeholder('', '', slots.length)

			contentEl.innerHTML = html
		}
	}

	function renderSlot(
		slot: any,
		parent_id: string = '',
		parent_field = '',
		parent_index = 0,
		withPlaceholder = true
	) {
		console.log(`renderSlot(${slot.id})`)
		let props: any = {}

		if (slot === '__list__') {
			return '__list__'
		}

		const component = getComponent(slot.type)
		const id = slot.id ?? getId()

		if (component?.raw) {
			for (let index in component.fields) {
				const field = component.fields[index]

				if (field.type === 'slot') {
					console.log(slot)
					let content = ''

					for (let index in slot.props?.[field.name] ?? []) {
						const x = slot.props[field.name][index]

						console.log('render: render inside renderSlot..')
						const res = renderSlot(x, id, field.name, +index)
						content += res + placeholder(id, field.name, +index + 1)
					}

					if (content) {
						props[field.name] = `<div class="slot${
							!content ? ' placeholder' : ''
						}" data-parent="${id}" data-index="0">${content}</div>`
					} else {
						props[field.name] = placeholder(id, field.name, 0, 'empty')
					}
				} else {
					props[field.name] = slot.props[field.name]
				}
			}

			props['Class'] = slot.props['Class'] ?? ''

			if (hbsTemplates[slot.type]) {
				setTimeout(() => {
					const isDraggable = interact('.component-item').draggable()

					function dragMoveListener(event) {
						dragging = true
						var target = event.target
						// keep the dragged position in the data-x/data-y attributes
						var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
						var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

						// translate the element
						target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

						target.style.opacity = '0.5'
						// update the posiion attributes
						target.setAttribute('data-x', x)
						target.setAttribute('data-y', y)
					}

					function dragStartListener(event) {
						dragging = true
						currentDraggable = event.target
					}

					function dragEndListener(event) {
						currentDraggable = null
						beforeY = 0
						beforeX = 0
						afterY = 0
						afterX = 0
					}

					if (!isDraggable.enabled) {
						interact.dynamicDrop(true)
						interact('.component-item').draggable({
							// hold: 1000,

							onstart: dragStartListener,
							// onmove: dragMoveListener,
							onend: (e) => {
								dragEndListener(e)
								const target = e.relatedTarget
								const source = e.currentTarget.id.split('-')[1]

								console.log({ target, source })

								if (target) {
									const parent = target.getAttribute('data-parent')
									const field = target.getAttribute('data-field')
									const index = +target.getAttribute('data-index')

									// let result = JSON.parse(JSON.stringify(slots));

									console.log('insertComponent', source, parent, field, index)
									insertComponent(source, parent, field, index)
								} else {
									console.log('render: else of drag end')
									render(activeSlot)
								}
							},
							// restrict: {
							// restriction: "parent",
							// endOnly: true,
							// elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
							// },
							autoScroll: { container: contentEl },
						})

						interact('.component-wrapper > *').draggable({
							// hold: 1000,
							// allowFrom: '.handle',
							onstart: dragStartListener,
							// onmove: dragMoveListener,
							onend: (e) => {
								dragEndListener(e)

								console.log(e)
								const target = e.relatedTarget
								const source = e.currentTarget.parentElement.id.split('-')[1]

								console.log({ target, source })
								if (target) {
									const parent = target.getAttribute('data-parent')
									const field = target.getAttribute('data-field')
									const index = target.getAttribute('data-index')

									console.log('moveComponent', source, parent, field, index)
									moveComponent(source, parent, field, index)
								} else {
									console.log('render: else of drag end 2')
									render(activeSlot)
								}
							},

							// restrict: {
							// restriction: "parent",
							// endOnly: true,
							// elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
							// },
							autoScroll: { container: contentEl },
							listeners: {},
						})
						interact('.placeholder').dropzone({
							//
							accept({ dropzone, draggableElement }) {
								console.log('accept')
								// allowedComponents of slot...
								return true
							},
						})

						var currentDraggable: any = null
						var beforeY = 0,
							beforeX = 0
						var afterY = 0,
							afterX = 0

						interact(contentEl).on('scroll', function () {
							if (!currentDraggable) {
								return
							}

							beforeY = afterY
							beforeX = afterX

							if (afterY == 0 && beforeY == 0) beforeY = this.scrollTop
							if (afterX == 0 && beforeX == 0) beforeX = this.scrollLeft

							afterY = this.scrollTop
							afterX = this.scrollLeft

							var y = (parseInt(currentDraggable.getAttribute('data-y')) || 0) + (afterY - beforeY)
							var x = (parseInt(currentDraggable.getAttribute('data-x')) || 0) + (afterX - beforeX)

							// translate the element
							currentDraggable.style.webkitTransform = currentDraggable.style.transform =
								'translate(' + x + 'px, ' + y + 'px)'

							// update the position attributes
							currentDraggable.setAttribute('data-x', x)
							currentDraggable.setAttribute('data-y', y)
						})
					}

					// interact('.slot.empty').dropzone({
					// 	//
					// 	accept({ dropzone, draggableElement }) {
					// 		console.log({ dropzone, draggableElement })
					// 		// allowedComponents of slot...
					// 		return true
					// 	},
					// }),

					document.querySelector(`[data-parent="${id}"]`)?.addEventListener('click', (e) => {
						e.stopPropagation()
						sidebarOpen = true
						newComponentPosition = id
						newComponentPositionField = e.target.getAttribute('data-field')
						newComponentPositionIndex = +e.target.getAttribute('data-index')

						selectSlot(id)
						mode = 'add'
					})

					const el = document.querySelector('#component-' + id)

					if (el) {
						el.addEventListener('click', (e) => {
							e.preventDefault()
							e.stopPropagation()

							selectSlot(id)
						})
						el.addEventListener('mouseenter', (e) => {
							onMouseEnter(e)
						})

						el.addEventListener('mouseleave', (e) => {
							onMouseLeave(e)
						})
					}
				}, 1)
				slot.id = id
				return `${
					withPlaceholder ? placeholder(parent_id, parent_field, parent_index) : ''
				}<div class="component-wrapper" id="component-${id}">${hbsTemplates[slot.type](
					props
				)}</div>`
			}
		}
		if (!component) return 'todo'

		return component.slot
			.map((x) => {
				console.log('renderSlot: render custom component...')
				return renderSlot(x)
			})
			.join('')
	}

	function forEachSlot(slots, cb, parent = null) {
		for (let slot of slots) {
			const component = getComponent(slot.type)
			cb(slot, parent, slots)

			for (let field of component.fields) {
				if (field.type === 'slot') {
					forEachSlot(slot.props[field.name] ?? [], cb, slot)
				}
			}
		}
	}

	function onSave() {
		const result = JSON.parse(JSON.stringify(page))

		forEachSlot(result.slot, (slot) => {
			delete slot['id']
			delete slot['parent_id']
			delete slot['parent_field']
			delete slot['parent_index']
		})

		fetch(`/edit/${page.id}/pages/${result.id}?/updatePage`, {
			method: 'POST',
			body: JSON.stringify(result),
		}).then((res) => {
			goto('/editor/' + result.id)
		})
	}

	function onRemoveSlot(id: string) {
		slots = slots.filter((x) => x.id !== id)

		forEachSlot(slots, (slot) => {
			const component = getComponent(slot.type)
			for (let field of component.fields) {
				if (field.type === 'slot') {
					slot.props[field.name] = (slot.props[field.name] ?? []).filter((x) => x.id !== id)
				}
			}
		})

		// TODO: can be optimized...
		render()

		mode = 'add'
		activeSlot = null
		activeComponent = null
		borderPosition = {}
	}

	function onSelectParent() {
		const slot = slots.find((x) => x.id === activeSlot.id)
		if (slot) {
			mode = 'add'
			activeSlot = null
			activeComponent = null
			borderPosition = {}
			return
		}

		forEachSlot(slots, (slot) => {
			const component = getComponent(slot.type)
			for (let field of component.fields) {
				if (field.type === 'slot') {
					const x = (slot.props[field.name] ?? []).find((x) => x.id === activeSlot.id)
					if (x) selectSlot(slot.id)
				}
			}
		})
	}

	function getComponent(id: string) {
		return components.find((x) => x.id === id)
	}

	let elStack: HTMLElement[] = []
	function onMouseEnter(e: MouseEvent) {
		if (e.target) {
			elStack = [...elStack, e.target as HTMLElement]
		}
	}
	function onMouseLeave(e: MouseEvent) {
		elStack = elStack.filter((x) => x !== e.target)
	}

	function findSlot(id: string, slots: any[], field = null, parent = null) {
		if (!id) return null
		console.log({ id, slots })
		for (let index in slots) {
			const slot = slots[index]
			const component = getComponent(slot.type)
			// const index = components.findIndex((x) => x.id === slot.type)

			if (slot.id === id) {
				slot.parent_id = parent?.id ?? null
				slot.parent_field = field
				slot.parent_index = index
				return slot
			}

			for (let field of component.fields) {
				if (field.type === 'slot') {
					const res = findSlot(id, slot.props[field.name] ?? [], field.name, slot)

					if (res) return res
				}
			}
		}
		return null
	}

	function selectSlot(id) {
		mode = 'options'

		if (!id) {
			mode = 'add'

			activeSlot = null
			activeComponent = null
			borderPosition = {}
		}
		let slotItem = findSlot(id, slots)

		if (slotItem) {
			sidebarOpen = true

			activeSlot = slotItem
			activeComponent = getComponent(activeSlot.type)

			setTimeout(() => {
				const rects = document
					.querySelector('#component-' + id)
					?.firstElementChild?.getBoundingClientRect()

				if (rects) {
					borderPosition.x = rects.left
					borderPosition.y = rects.top
					borderPosition.w = rects.width
					borderPosition.h = rects.height
				}
			}, 1)
		}
	}

	$: {
		if (activeSlot) {
			console.log('render: active Slot changed')
			// re render Active slot
			render(activeSlot)

			updateActiveBorder()
		}
	}

	function moveComponent(
		slot_id: string,
		parent_id: string = '',
		field_name: string = '',
		index: number = 0
	) {
		const slot = findSlot(slot_id, slots)

		insertComponent(slot.type, parent_id, field_name, index, slot.props)
		onRemoveSlot(slot.id)
	}
	function insertComponent(
		component_id: string,
		parent_id: string = '',
		field_name: string = '',
		index: number = 0,
		props = {}
	) {
		mode = 'options'

		const id = getId()

		let newSlot = {
			id,
			type: component_id,
			props, // default value
		}

		if (!parent_id) {
			// slots.push(newSlot)
			slots = [...slots.slice(0, index), newSlot, ...slots.slice(index)]
			setTimeout(() => {
				selectSlot(id)
			}, 1)
		}

		function findAndInsert(slot) {
			const component_ = getComponent(slot.type)

			for (let field of component_.fields) {
				if (slot.id === parent_id && field.name === field_name) {
					slot.props[field.name] ??= []
					// insert at index

					slot.props[field.name] ??= []

					if (index === 0) {
						slot.props[field.name].push(newSlot)
					} else {
						slot.props[field.name] = [
							...slot.props[field.name].slice(0, index),
							newSlot,
							...slot.props[field.name].slice(index),
						]
					}
					setTimeout(() => {
						selectSlot(id)
					}, 1)
				} else if (field.type === 'slot') {
					for (let subSlot of slot.props[field.name] ?? []) {
						findAndInsert(subSlot)
					}
				}
			}
		}

		for (let slot of slots) {
			findAndInsert(slot)
		}

		console.log('render: insert component...')

		render()
	}

	async function onExtractComponent() {
		// activeSlot.props

		const value = await modal.open(AddComponentModal, {
			//
		})

		if (value?.name) {
			if (components.map((x) => x.name).includes(value.name)) {
				return
			}

			console.log(activeSlot)
			// const slot = activeSlot.

			const newComponent = {
				name: value.name,
				fields: [],
				slot: [{ type: activeSlot.type, props: activeSlot.props }],
			}

			fetch(`/edit/${page.id}/components/?/createComponent`, {
				method: 'POST',
				body: JSON.stringify(newComponent),
			}).then((res) => {
				goto('/editor/' + page.id)
			})
		}
	}

	function updateActiveBorder() {
		hoverBorderPosition = {}
		if (!activeSlot) return

		setTimeout(() => {
			const rects = document
				.querySelector('#component-' + activeSlot.id)
				?.firstElementChild?.getBoundingClientRect()

			if (rects) {
				borderPosition.x = rects.left
				borderPosition.y = rects.top
				borderPosition.w = rects.width
				borderPosition.h = rects.height
			}

			if (elStack.length) {
				const el = elStack[elStack.length - 1]

				const rects = el.firstElementChild?.getClientRects()

				if (rects?.length) {
					hoverBorderPosition.x = rects[0].left
					hoverBorderPosition.y = rects[0].top
					hoverBorderPosition.w = rects[0].width
					hoverBorderPosition.h = rects[0].height
				}
			} else {
				hoverBorderPosition = {}
			}
		})
	}

	$: {
		sidebarOpen
		setTimeout(() => {
			updateActiveBorder()
		}, 400)
	}

	onMount(() => {
		for (let component of components) {
			hbsTemplates[component.id] = hbs.compile(component.template)
		}

		console.log('render: on mount')
		render()

		contentEl.addEventListener('scroll', updateActiveBorder)
	})

	let sidebarOpen = false
</script>

<svelte:head>
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<script src="/cdn.tailwindcss.com.js"></script>
</svelte:head>
{#if type === 'page' || type === 'component'}
<div class="page" data-bs-theme="dark">
	<div class="header" class:sidebar-open={sidebarOpen}>
		<div style="display: flex; align-items: center; gap: 4px;">
			

			<button
				on:click={() => {
                    offcanvasOpen = true
                    goto(`/edit/${page.id}/pages`)
                    }}
				class="font-bold"
				style="color: #a0d0ff; line-height: 20px; font-size: 16px;">
				<Icon name="menu-2"/>
			</button>

			<div class="font-bold mb-0.5 mx-2" style="display: flex; align-items: center; color: #a0d0ff">
				<Icon size="lg" on:click={() => {
                    offcanvasOpen = true
                    goto(`/edit/${page.id}/pages/${page.id}`)
                    }} name="settings" />
			</div>
		</div>

		<div style="display: flex; align-items: center; gap: 8px">
			<Button on:click={onSave} class="bg-blue-500 h-[24px] px-[8px]" color="primary" size="sm"
				>Save</Button>
			<Button
				href="/{page.slug}"
				on:click={onSave}
				class="bg-green-500 h-[24px] px-[8px]"
				color="success"
				size="sm">View</Button>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:click={() => {
					if (sidebarOpen && mode === 'options') {
						mode = 'slot'
					} else {
						sidebarOpen = !sidebarOpen
						mode = 'slot'
					}
				}}
				class="toggle mb-0.5">
				<Icon name="menu-deep" />
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:click={() => {
					if (sidebarOpen && mode === 'options') {
						mode = 'add'
					} else {
						sidebarOpen = !sidebarOpen
						mode = 'add'
					}
				}}
				class="toggle mb-0.5">
				{#if sidebarOpen}
					{#if mode === 'options'}
						<Icon size="lg" name="category-filled" />
					{:else}
						<Icon size="lg" name="x" />
					{/if}
				{:else}
					<Icon size="lg" name="category-filled" />
				{/if}
			</div>
		</div>
	</div>

	<Offcanvas style="width: 700px" backdrop autoClose placement="start" bind:show={offcanvasOpen}>
		<OffcanvasBody>
			<!--  -->
			<!-- <PageList data={}/> -->
			<!-- Content -->
			<slot />
		</OffcanvasBody>
	</Offcanvas>

	<div class="sidebar" class:open={sidebarOpen}>
		{#if activeSlot}
			<El class="component-name">{getComponent(activeSlot.type).name}</El>
		{/if}
		<div class="sidebar-body">
			{#if mode === 'add'}
				{#if activeSlot}
					<Button on:click={() => (mode = 'options')} bgColor="primary">Options</Button>
				{/if}
				{#each components as component}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="component-item"
						id="component-{component.id}"
						on:mousedown={() => (dragging = true)}
						on:click={() =>
							insertComponent(
								component.id,
								newComponentPosition,
								newComponentPositionField,
								newComponentPositionIndex
							)}>
						{component.name}
					</div>
				{/each}
			{:else if mode == 'slot'}
				<div class="h-[32px] border-b border-gray-500">Slots</div>
				{#each slots as slot}
					<SlotSidebarItem
						on:open-settings={() => (mode = 'options')}
						{components}
						{slot}
						bind:activeSlot />
				{/each}
			{:else if activeSlot}
				<Tabs>
					<TabList>
						<TabItem>Props</TabItem>
						<TabItem>Style</TabItem>
					</TabList>
					<TabContent>
						<TabPanel p="2">
							{#each activeComponent.fields as field}
								{#if field.type !== 'slot'}
									<ComponentProp
										{components}
										items={{}}
										{field}
										bind:value={activeSlot.props[field.name]} />
								{/if}
							{/each}

							<El row>
								<El col></El>
							</El>
						</TabPanel>
						<TabPanel p="2">
							<El row>
								<El col>
									<FormInput label="Class" bind:value={activeSlot.props.Class} />
								</El>
							</El>
						</TabPanel>
					</TabContent>
				</Tabs>
			{/if}
		</div>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={() => selectSlot('')}
		bind:this={contentEl}
		class="content"
		class:dragging
		class:sidebar-open={sidebarOpen}>
	</div>

	<div
		class="component-hover-border"
		style="display: {hoverBorderPosition.w
			? 'block'
			: 'none'}; width: {hoverBorderPosition.w}px; height: {hoverBorderPosition.h}px; left: {hoverBorderPosition.x}px; top: {hoverBorderPosition.y}px">
	</div>

	<div
		class="component-border"
		style="display: {borderPosition.w
			? 'block'
			: 'none'}; width: {borderPosition.w}px; height: {borderPosition.h}px; left: {borderPosition.x}px; top: {borderPosition.y}px">
		<div class="buttons-container">
			<div class="buttons-container-absolute">
				<div style="pointer-events: all; z-index: 4">
					<Icon on:click={onSelectParent} size="xs" bgColor="primary" name="arrow-up" />
					<Icon on:click={onExtractComponent} size="xs" bgColor="warning" name="star" />

					<!-- <Icon class="handle" size="xs" bgColor="primary" name="move" /> -->
				</div>

				<div style="pointer-events: all; z-index: 4">
					<Icon on:click={() => onRemoveSlot(activeSlot.id)} size="xs" bgColor="red" name="x" />
				</div>
			</div>
		</div>
	</div>
	<ModalProvider />
</div>
{:else}
    <div>Page or component not found <a href="/edit">Go Back</a></div>
{/if}

<style>
	:global(body),
	:global(html) {
		padding: 0;
		margin: 0;
		height: 100%;
	}

	.page {
		display: flex;
		height: 100%;
		overflow: hidden;
		position: relative;
		flex-direction: column;
	}

	.content {
		color: black;
		margin: 8px;
		width: calc(100% - 16px);
		transition: all 0.3s ease-in-out;
		height: 100%;
		overflow-y: auto;
		background-color: white;
	}

	.content.sidebar-open {
		width: calc(100% - 216px);
	}

	.component-item {
		padding: 0.5rem;
		margin: 0.25rem;
		border-radius: 4px;
		box-shadow: 0 4px 8px -8px black;
		background-color: var(--y-bg-surface);
		border: 1px solid var(--y-border-color);
	}

	.header {
		transition: all 0.3s ease-in-out;
		padding: 0 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 36px;
		box-shadow: 0 2px 4px -2px black;
		border-bottom: 1px solid var(--y-bg-surface);
		background-color: var(--y-bg-surface-tertiary);
		color: white;
		width: 100%;
	}

	.header.sidebar-open {
		width: calc(100% - 200px);
	}

	.sidebar {
		position: absolute;
		width: 200px;
		right: 0;
		top: 0;
		bottom: 0;
		transition: all 0.3s ease-in-out;
		transform: translateX(300px);
		background-color: var(--y-bg-surface-tertiary);
		box-shadow: -2px 26px 4px -2px black;
		color: white;
	}

	/* :global(.component-wrapper) {
		position: relative;
	}
	:global(.component-wrapper .handle) {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.5;
		width: 25px;
		height: 25px;
		background-color: #20202020;
	} */
	:global(.y-tab-item-link) {
		padding-top: 4px;
		padding-bottom: 4px;
	}
	/* .sidebar-body {
		padding: 8px;
	} */

	.sidebar.open {
		transform: translateX(0);
	}

	:global(.component-wrapper) {
		display: contents;
		border: 1px solid red;
		min-height: 4px;
	}

	.component-border {
		border: 2px solid var(--y-primary);
		position: absolute;
		display: none;
		pointer-events: none;
	}

	:global(.component-name) {
		background-color: black;
		border-bottom: 1px solid var(--y-bg-surface);
		line-height: 20px;
		font-size: 16px;
		height: 27px;

		padding: 4px;
	}

	.component-hover-border {
		transition: all 0.2s ease;
		border: 1px dashed var(--y-primary);
		position: absolute;
		display: none;
		pointer-events: none;
	}

	.buttons-container {
		position: relative;
	}
	.buttons-container-absolute {
		position: absolute;
		bottom: 100%;
		display: flex;
		justify-content: space-between;
		height: 12px;
		display: flex;
		width: 100%;
	}
	.buttons-container-absolute > * {
		pointer-events: all;
		cursor: pointer;
	}

	:global(.slot) {
		display: contents;
	}

	:global(.placeholder) {
		display: block;
		align-self: stretch;
		width: auto;
		transition: all 0.3s ease;
		opacity: 0;
		position: relative;
		z-index: 1 !important;
		min-width: 0px;
		margin-left: 0px;
		margin-right: 0px;
		min-height: 0px;
	}

	:global(.dragging .placeholder) {
		min-width: 8px;
		margin: -4px;
		min-height: 8px;
	}
	:global(.placeholder::before) {
		content: '';
		background-color: var(--y-primary);
		opacity: 0.5;
		filter: blur(2px);
		position: absolute;
		top: -0.3rem;
		bottom: -0.3rem;
		left: -0.2rem;
		right: -0.2rem;
	}

	:global(.placeholder::before) {
		top: -0.1rem;
		bottom: -0.1rem;
		left: 0rem;
		right: 0rem;
	}

	:global(.placeholder::after) {
		content: '';
		transition: scale 0.5s ease;
		background-color: var(--y-primary);
		position: absolute;
		top: 0.2rem;
		bottom: 0.2rem;
		left: 0.2rem;
		right: 0.2rem;
		scale: 0;
	}

	:global(.placeholder:hover::after) {
		scale: 1;
	}
	:global(.placeholder:hover) {
		opacity: 1;
		scale: 1;
	}

	.dragging :global(.placeholder) {
		/* width: 12px; */
		/* height: 12px; */
		display: block;
	}

	:global(.placeholder.empty) {
		display: contents;
		display: flex;
		opacity: 0.2 !important;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		min-width: 30px;
		min-height: 30px;
		width: 100%;
		height: 100%;
		opacity: 1;
		background-color: #4060a020;
	}
	:global(.placeholder.empty::before) {
		content: 'Click to add component';
		color: var(--y-primary);
	}

	/* :global(.slot > *) {
		border: 1px solid blue;
		min-width: 20px;
		min-height: 20px;
	} */

	.buttons-container-absolute :global(.y-icon) {
		display: flex;
	}
</style>
