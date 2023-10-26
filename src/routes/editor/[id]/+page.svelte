<script lang="ts">
	import ComponentProp from '$lib/ui/ComponentProp.svelte'
	import { nanoid as getId } from 'nanoid'
	import hbs from 'handlebars'
	import '@ulibs/yesvelte/styles.css'
	import { onMount, tick } from 'svelte'
	import {
		Button,
		Card,
		El,
		Icon,
		ModalProvider,
		TabContent,
		TabItem,
		TabList,
		TabPanel,
		Tabs,
	} from '@ulibs/yesvelte'
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import AddComponentModal from '../../admin/components/AddComponentModal.svelte'
	export let data

	let activeComponent: any = null
	let activeSlot: any = null

	let newComponentPosition: string | null = null
	let newComponentPositionField: any = null
	let newComponentPositionIndex: any = null

	let mode = 'options'

	let borderPosition: any = {}
	let hoverBorderPosition: any = {}

	let props = {}

	const hbsTemplates: any = {}

	let html = ''

	function render() {
		html = data.page.slot.map((x) => renderSlot(x)).join('')
	}

	function renderSlot(slot: any) {
		let props: any = {}
		const component = getComponent(slot.type)
		const id = slot.id ?? getId()

		if (component.raw) {
			for (let index in component.fields) {
				const field = component.fields[index]

				if (field.type === 'slot') {
					let content = ''
					for (let x of slot.props?.[field.name] ?? []) {
						const res = renderSlot(x)
						content += res
					}
					props[field.name] = `<div data-parent="${id}" data-index="${index}" data-field="${
						field.name
					}" class="slot${!content ? ' empty' : ''}">${content}</div>`
				} else {
					props[field.name] = slot.props[field.name]
				}
			}

			if (hbsTemplates[slot.type]) {
				setTimeout(() => {
					document.querySelector(`[data-parent="${id}"]`)?.addEventListener('click', (e) => {
						e.stopPropagation()
						sidebarOpen = true
						newComponentPosition = id
						newComponentPositionField = e.target.getAttribute('data-field')
						newComponentPositionIndex = +e.target.getAttribute('data-index')

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
				return `<div class="component-wrapper" id="component-${id}">${hbsTemplates[slot.type](
					props
				)}</div>`
			}
		}

		return 'undefined..'
	}

	function forEachSlot(slots, cb, parent = null) {
		console.log('forEachSlot', { slots, cb, parent })
		for (let slot of slots) {
			const component = getComponent(slot.type)

			console.log('cb', { slot, parent, slots })
			cb(slot, parent, slots)
			for (let field of component.fields) {
				if (field.type === 'slot') {
					console.log('slot of: ', slot)
					forEachSlot(slot.props[field.name] ?? [], cb, slot)
				}
			}
		}
	}

	function onSave() {
		const result = JSON.parse(JSON.stringify(data.page))

		forEachSlot(result.slot, (slot) => {
			delete slot['id']
			delete slot['parent_id']
			delete slot['parent_field']
			delete slot['parent_index']
		})

		fetch(`/admin/pages/${result.id}?/updatePage`, {
			method: 'POST',
			body: JSON.stringify(result),
		}).then((res) => {
			goto('/editor/' + result.id)
		})
	}

	function onRemoveSlot() {
		data.page.slot = data.page.slot.filter((x) => x.id !== activeSlot.id)

		forEachSlot(data.page.slot, (slot) => {
			const component = getComponent(slot.type)
			for (let field of component.fields) {
				if (field.type === 'slot') {
					slot.props[field.name] = (slot.props[field.name] ?? []).filter(
						(x) => x.id !== activeSlot.id
					)
				}
			}
		})
		render()

		mode = 'add'
		activeSlot = null
		activeComponent = null
		borderPosition = {}
	}

	function onSelectParent() {
		const slot = data.page.slot.find((x) => x.id === activeSlot.id)
		if (slot) {
			mode = 'add'
			activeSlot = null
			activeComponent = null
			borderPosition = {}
			return
		}

		forEachSlot(data.page.slot, (slot) => {
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
		return data.components.find((x) => x.id === id)
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
		for (let index in slots) {
			const slot = slots[index]
			const component = getComponent(slot.type)
			// const index = data.components.findIndex((x) => x.id === slot.type)

			console.log(slot, slots)
			if (slot.id === id) {
				slot.parent_id = parent?.id ?? null
				slot.parent_field = field
				slot.parent_index = index
				return slot
			}

			for (let field of component.fields) {
				if (field.type === 'slot') {
					const res = findSlot(id, slot.props[field.name] ?? [], field.name, slot)

					console.log('res: ', res)
					if (res) return res
				}
			}
		}
		return null
	}

	function selectSlot(id) {
		console.log('selectSlot: ', { id })
		mode = 'options'

		if (!id) {
			mode = 'add'

			activeSlot = null
			activeComponent = null
			borderPosition = {}
		}
		let slotItem = findSlot(id, data.page.slot)

		console.log(slotItem)

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
	let content

	$: {
		if (activeSlot) {
			console.log('activeSlot: ', 'render')
			render()
			updateActiveBorder()
		}
	}

	function addComponent(component: any) {
		mode = 'options'

		const id = getId()

		let newSlot = {
			id,
			type: component.id,
			props: {}, // default value
		}

		if (!newComponentPosition) {
			data.page.slot.push(newSlot)
			setTimeout(() => {
				selectSlot(id)
			}, 1)
		}

		function findAndInsert(slot) {
			const component_ = getComponent(slot.type)
			console.log('found slot')
			for (let field of component_.fields) {
				if (slot.id === newComponentPosition && field.name === newComponentPositionField) {
					console.log('found....')
					slot.props[field.name] ??= []
					// insert at index

					console.log('find and insert', { newComponentPositionIndex })
					slot.props[field.name] ??= []

					if (newComponentPositionIndex === 0) {
						slot.props[field.name].push(newSlot)
					} else {
						slot.props[field.name] = [
							...slot.props[field.name].slice(0, newComponentPositionIndex),
							newSlot,
							...slot.props[field.name].slice(newComponentPositionIndex),
						]
					}
					setTimeout(() => {
						selectSlot(id)
					}, 1)
				} else if (field.type === 'slot') {
					for (let subSlot of slot.props[field.name] ?? []) {
						console.log('find sub slot')
						findAndInsert(subSlot)
					}
				}
			}
		}

		for (let slot of data.page.slot) {
			findAndInsert(slot)
		}

		newComponentPosition = null

		render()
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
		})
	}

	$: {
		sidebarOpen
		setTimeout(() => {
			updateActiveBorder()
		}, 400)
	}

	onMount(() => {
		for (let component of data.components) {
			hbsTemplates[component.id] = hbs.compile(component.template)
		}
		render()

		content.addEventListener('scroll', updateActiveBorder)
	})

	let sidebarOpen = false

	$: if (elStack.length) {
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
</script>

<svelte:head>
	{@html data.head}
</svelte:head>
<div class="page" data-bs-theme="dark">
	<div class="header" class:sidebar-open={sidebarOpen}>
		<div style="display: flex; align-items: center; gap: 1rem;">
			<div class="font-bold" style="display: flex; align-items: center; color: #a0d0ff">
				<Icon on:click={() => goto(`/admin/pages/${data.page.id}`)} name="chevron-left" />
			</div>

			<div class="font-bold" style="color: #a0d0ff">UI Builder</div>
		</div>

		<div style="display: flex; gap: 4px">
			<a
				href="/{data.page.slug}"
				style="display: flex; align-items: center; gap: 8px; border: 1px solid #405060; background-color: #252525; padding: 2px 8px;">
				<Icon size="sm" name="eye" />
				<span>/{data.page.slug}</span>
			</a>

			<Button on:click={onSave} class="bg-blue-500" color="primary" size="sm">Save</Button>

			<div
				on:click={() => {
					sidebarOpen = !sidebarOpen
					mode = 'add'
				}}
				class="toggle">
				{#if sidebarOpen}
					<Icon name="x" />
				{:else}
					<Icon name="menu-2" />
				{/if}
			</div>
		</div>
	</div>

	<div class="sidebar" class:open={sidebarOpen}>
		{#if mode === 'add'}
			{#each data.components as component}
				<div class="component-item" on:click={() => addComponent(component)}>{component.name}</div>
			{/each}
		{:else if activeSlot}
			<div class="sidebar-body">
				<Tabs>
					<TabList>
						<TabItem>Props</TabItem>
					</TabList>
					<TabContent>
						<TabPanel p="2">
							{#each activeComponent.fields as field}
								{#if field.type !== 'slot'}
									<ComponentProp
										components={data.components}
										items={{}}
										{field}
										bind:value={activeSlot.props[field.name]} />
								{/if}
							{/each}

							<El row>
								<El col>
									<Button
										on:click={() => {
											console.log(activeSlot)
											newComponentPosition = activeSlot.parent_id
											newComponentPositionField = activeSlot.parent_field
											newComponentPositionIndex = +activeSlot.parent_index
											sidebarOpen = true
											mode = 'add'
										}}>Insert Before</Button>
									<Button
										on:click={() => {
											newComponentPosition = activeSlot.parent_id
											newComponentPositionField = activeSlot.parent_field
											newComponentPositionIndex = +activeSlot.parent_index + 1
											sidebarOpen = true
											mode = 'add'
										}}>Insert After</Button>
								</El>
							</El>
						</TabPanel>
					</TabContent>
				</Tabs>
			</div>
		{/if}
	</div>
	<div
		on:click={() => selectSlot()}
		bind:this={content}
		class="content"
		class:sidebar-open={sidebarOpen}>
		<!-- {JSON.stringify(data.page)} -->
		{@html html}
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
				<div style="pointer-events: all">
					<Icon on:click={onSelectParent} size="xs" bgColor="primary" name="arrow-up" />
					<!-- <Icon on:click={console.log} size="xs" bgColor="primary" name="arrow-left" /> -->
					<!-- <Icon on:click={console.log} size="xs" bgColor="primary" name="arrow-right" /> -->
				</div>

				<div style="pointer-events: all">
					<Icon on:click={onRemoveSlot} size="xs" bgColor="red" name="x" />
				</div>
			</div>
		</div>
	</div>
	<ModalProvider />
</div>

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
		width: 100%;
		transition: all 0.3s ease-in-out;
		height: 100%;
		overflow-y: auto;
		background-color: white;
	}

	.content.sidebar-open {
		width: calc(100% - 200px);
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
		padding: 4px 4px 4px 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* height: 30px; */
		background-color: black;
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
		color: white;
	}
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
	}

	.component-border {
		border: 2px solid var(--y-primary);
		position: absolute;
		display: none;
		pointer-events: none;
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

	:global(.slot.empty) {
		display: contents;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		min-width: 30px;
		min-height: 30px;
		height: 100%;
		background-color: #4060a020;
	}
	:global(.slot.empty::before) {
		content: 'Click to add component';
		color: var(--y-primary);
	}

	:global(.slot > *) {
		border: 1px solid blue;
		min-width: 20px;
		min-height: 20px;
	}

	.buttons-container-absolute :global(.y-icon) {
		display: flex;
	}
</style>
