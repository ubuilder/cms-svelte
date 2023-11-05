<script lang="ts">
	import EditorOffcanvases from './EditorOffcanvases.svelte'

	import ComponentProp from '$lib/ui/ComponentProp.svelte'
	import { customAlphabet } from 'nanoid'
	import hbs from 'handlebars'
	import '@ulibs/yesvelte/styles.css'
	import './Editor.css'
	import { onMount, tick } from 'svelte'
	import {
		AlertProvider,
		Button,
		Card,
		El,
		FormInput,
		Icon,
		Loading,
		ModalProvider,
		Offcanvas,
		OffcanvasBody,
		TabContent,
		TabItem,
		TabList,
		TabPanel,
		Tabs,
		alert,
		Page,
		modal,
		ButtonList,
	} from '@ulibs/yesvelte'
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import AddComponentModal from '$lib/components/components/AddComponentModal.svelte'
	import { browser } from '$app/environment'
	
	import SlotSidebarItem from './SlotSidebarItem.svelte'
	import { DragDrop } from '$lib/helpers/drag-drop'
	import SidebarTableList from './SidebarTableList.svelte'
	import SidebarPageList from './SidebarPageList.svelte'
	import { api } from '$lib/helpers/api'
	import SidebarSlotList from './SidebarSlotList.svelte'
	import SidebarComponentList from './SidebarComponentList.svelte'
	import SidebarComponentOption from './SidebarComponentOption.svelte'
	import HeaderItem from './HeaderItem.svelte'

	let components: any[] = []
	export let type = 'page'
	let tables: any[] = []
	export let assets: any[] = []
	export let forms: any[] = []

	let pages: any[] = []

	export let page_id: any = undefined

	let page = {}

	export let component: any = {}

	let draggableModule: typeof import('@shopify/draggable') | null = null

	$: slots = page.slot ?? []

	let activeComponent: any = null
	let activeSlot: any = null

	let mode = 'options'
	let contentEl: any

	let borderPosition: any = {}
	let hoverBorderPosition: any = {}

	let offcanvasMode = 'edit'

	let dragging = false

	let activeTable: any = null
	let instance: any = null

	const slotMap: any = {}

	function nanoid() {
		return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
	}

	function getId() {
		return nanoid()()
	}

	const hbsTemplates: any = {}

	const placeholder = (parent: string, field: string = '', index: number = 0, className = '') =>
		`<span class="placeholder ${className}" data-dropzone data-parent="${parent}" data-index="${index}" data-field="${field}"></span>`

	let html = ''

	let leftOffcanvasOpen = false
	let rightOffcanvasOpen = false

	function render(slot = null) {
		if (draggableModule !== null) {
			setTimeout(() => {
				console.log('initialize draggable')
				if (instance) {
					instance.destroy()

					instance = null
				}

				document.querySelectorAll('.component-wrapper > :first-child').forEach((x) => {
					x.setAttribute('data-draggable', '')

					x.setAttribute('data-id', x.parentElement.id)
				})

				instance = DragDrop(document.querySelector('.page'), {
					draggable: '[data-draggable]',
					dropzone: '[data-dropzone]',
				})

				instance.on('start', (event) => {
					// event.current.classList.add('current-draggable')
					dragging = true
				})

				instance.on('return', (event) => {
					// event.current.classList.remove('current-draggable')
					dragging = false
				})

				instance.on('drop', (event) => {
					dragging = false
					// event.current.classList.remove('current-draggable')

					const target = event.target
					const source = event.source.dataset.id.split('-')[1]
					// 	const target = event.data.dropzone
					// 	const source = event.data.dragEvent.source.dataset.id.split('-')[1]

					console.log({ target, source: event.source })

					if (target) {
						const parent = target.getAttribute('data-parent')
						const field = target.getAttribute('data-field')
						const index = +target.getAttribute('data-index')

						console.log('move or insert: ', { source, parent, field, index })

						if (event.source.dataset.mode === 'clone') {
							insertComponent(source, parent, field, index)
						} else {
							if (source && parent && field) {
								moveComponent(source, parent, field, index)
							} else if (source && parent === '' && field === '' && !isNaN(index)) {
								moveComponent(source, parent, field, index)
							}
						}
					}
					// 		console.log('moveComponent', source, parent, field, index)
					// 		if (source && ((parent && field && !isNaN(index)) || (!parent && !field))) {
					// 			if(event.data.dragEvent.source.dataset.mode === 'clone') {
					// 				insertComponent(source, parent, field, index)
					// 			} else {
					// 				if(parent !== field) {
					// 					moveComponent(source, parent, field, index)
					// 				}
					// 			}
					// 		}
					// 	}
				})

				// instance = new draggableModule!.Droppable(document.querySelectorAll('.page'), {
				// 	draggable: '[data-draggable]',
				// 	dropzone: '[data-dropzone]',
				// 	classes: {
				// 		'draggable:active': 'bg-green-400',
				// 		'source:dragging': 'bg-red-500',
				// 		mirror: 'bg-blue-500',
				// 		'source:original': 'bg-sky-300'
				// 	}
				// 	// 	'droppable:active': 'highlight',
				// 	// 	'source:dragging': 'component-original',
				// 	// 	'source:original': 'component-dragging',
				// 	// 	mirror: 'mirror',
				// 	// 	'container:dragging': 'dragging',
				// 	// },
				// })

				// console.log(instance)

				// instance.on('droppable:stop', (event) => {
				// 	console.log('event: ', event)
				// 	console.log(event.data.dragEvent.source.dataset.id)
				// 	console.log(event.data.dropzone)

				// 	const target = event.data.dropzone
				// 	const source = event.data.dragEvent.source.dataset.id.split('-')[1]

				// 	// 				console.log({ target, source })

				// 	if (target) {
				// 		const parent = target.getAttribute('data-parent')
				// 		const field = target.getAttribute('data-field')
				// 		const index = +target.getAttribute('data-index')

				// 		console.log('moveComponent', source, parent, field, index)
				// 		if (source && ((parent && field && !isNaN(index)) || (!parent && !field))) {
				// 			if(event.data.dragEvent.source.dataset.mode === 'clone') {
				// 				insertComponent(source, parent, field, index)
				// 			} else {
				// 				if(parent !== field) {
				// 					moveComponent(source, parent, field, index)
				// 				}
				// 			}
				// 		}
				// 	}
				// })
			}, 5)
		} else {
			import('@shopify/draggable').then((mod) => {
				draggableModule = mod

				render()
			})
			return ''
		}

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

		slot.parent_id = parent_id ?? null
		slot.parent_field = parent_field
		slot.parent_index = parent_index

		slotMap[id] = slot

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
						props[
							field.name
						] = `<div class="slot" data-parent="${id}" data-index="0">${content}</div>`
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
					document.querySelector(`[data-parent="${id}"]`)?.addEventListener('click', (e) => {
						e.stopPropagation()
						rightSidebarOpen = true
						// newComponentPosition = id
						// newComponentPositionField = e.target.getAttribute('data-field')
						// newComponentPositionIndex = +e.target.getAttribute('data-index')

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
				}, 5)

				slot.id = id
				return `${
					withPlaceholder ? placeholder(parent_id, parent_field, parent_index) : ''
				}<div class="component-wrapper" id="component-${id}">${hbsTemplates[slot.type](
					props
				)}</div>`

				// setTimeout(() => {
				// 	const isDraggable = interact('.component-item').draggable()

				// 	function dragMoveListener(event) {
				// 		dragging = true
				// 		var target = event.target
				// 		// keep the dragged position in the data-x/data-y attributes
				// 		var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
				// 		var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

				// 		// translate the element
				// 		target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

				// 		target.style.opacity = '0.5'
				// 		// update the posiion attributes
				// 		target.setAttribute('data-x', x)
				// 		target.setAttribute('data-y', y)
				// 	}

				// 	function dragStartListener(event) {
				// 		dragging = true
				// 		currentDraggable = event.target
				// 	}

				// 	function dragEndListener(event) {
				// 		currentDraggable = null
				// 		beforeY = 0
				// 		beforeX = 0
				// 		afterY = 0
				// 		afterX = 0
				// 	}

				// 	if (!isDraggable.enabled) {
				// 		interact.dynamicDrop(true)
				// 		interact('.component-item').draggable({
				// 			// hold: 1000,

				// 			onstart: dragStartListener,
				// 			// onmove: dragMoveListener,
				// 			onend: (e) => {
				// 				dragEndListener(e)
				// 				const target = e.relatedTarget
				// 				const source = e.currentTarget.id.split('-')[1]

				// 				console.log({ target, source })

				// 				if (target) {
				// 					const parent = target.getAttribute('data-parent')
				// 					const field = target.getAttribute('data-field')
				// 					const index = +target.getAttribute('data-index')

				// 					// let result = JSON.parse(JSON.stringify(slots));

				// 					console.log('insertComponent', source, parent, field, index)
				// 					insertComponent(source, parent, field, index)
				// 				} else {
				// 					console.log('render: else of drag end')
				// 					render(activeSlot)
				// 				}
				// 			},
				// 			// restrict: {
				// 			// restriction: "parent",
				// 			// endOnly: true,
				// 			// elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				// 			// },
				// 			autoScroll: { container: contentEl },
				// 		})

				// 		console.log(document.querySelectorAll('.component-wrapper > :first-child'))
				// 		interact('.component-wrapper > :first-child').draggable({
				// 			// hold: 1000,
				// 			// allowFrom: '.handle',
				// 			onstart: dragStartListener,
				// 			// onmove: dragMoveListener,
				// 			onend: (e) => {
				// 				dragEndListener(e)

				// 				console.log(e)
				// 				const target = e.relatedTarget
				// 				const source = e.currentTarget.parentElement.id.split('-')[1]

				// 				console.log({ target, source })
				// 				if (target) {
				// 					const parent = target.getAttribute('data-parent')
				// 					const field = target.getAttribute('data-field')
				// 					const index = target.getAttribute('data-index')

				// 					console.log('moveComponent', source, parent, field, index)
				// 					moveComponent(source, parent, field, index)
				// 				} else {
				// 					console.log('render: else of drag end 2')
				// 					render(activeSlot)
				// 				}
				// 			},

				// 			// restrict: {
				// 			// restriction: "parent",
				// 			// endOnly: true,
				// 			// elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				// 			// },
				// 			autoScroll: { container: contentEl },
				// 			listeners: {},
				// 		})
				// 		interact('.placeholder').dropzone({
				// 			//
				// 			accept({ dropzone, draggableElement }) {
				// 				console.log('accept')
				// 				// allowedComponents of slot...
				// 				return true
				// 			},
				// 		})

				// 		var currentDraggable: any = null
				// 		var beforeY = 0,
				// 			beforeX = 0
				// 		var afterY = 0,
				// 			afterX = 0

				// 		interact(contentEl).on('scroll', function () {
				// 			if (!currentDraggable) {
				// 				return
				// 			}

				// 			beforeY = afterY
				// 			beforeX = afterX

				// 			if (afterY == 0 && beforeY == 0) beforeY = this.scrollTop
				// 			if (afterX == 0 && beforeX == 0) beforeX = this.scrollLeft

				// 			afterY = this.scrollTop
				// 			afterX = this.scrollLeft

				// 			var y = (parseInt(currentDraggable.getAttribute('data-y')) || 0) + (afterY - beforeY)
				// 			var x = (parseInt(currentDraggable.getAttribute('data-x')) || 0) + (afterX - beforeX)

				// 			// translate the element
				// 			currentDraggable.style.webkitTransform = currentDraggable.style.transform =
				// 				'translate(' + x + 'px, ' + y + 'px)'

				// 			// update the position attributes
				// 			currentDraggable.setAttribute('data-x', x)
				// 			currentDraggable.setAttribute('data-y', y)
				// 		})
				// 	}

				// 	// interact('.slot.empty').dropzone({
				// 	// 	//
				// 	// 	accept({ dropzone, draggableElement }) {
				// 	// 		console.log({ dropzone, draggableElement })
				// 	// 		// allowedComponents of slot...
				// 	// 		return true
				// 	// 	},
				// 	// }),
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

	function forEachSlot(slots = [], cb, parent = null) {
		console.log(slots)
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
		console.log('onSave', page, slots)
		page.slot = slots
		const result = JSON.parse(JSON.stringify(page))

		forEachSlot(result.slot, (slot) => {
			delete slot['id']
			delete slot['parent_id']
			delete slot['parent_field']
			delete slot['parent_index']
		})

		fetch(`/edit/${page.id}?/updatePage`, {
			method: 'POST',
			body: JSON.stringify(result),
		}).then((res) => {
			goto('/edit/' + result.id, { invalidateAll: true })
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

	// function findSlot(id: string, slots: any[], field = null, parent = null) {
	// 	console.log("findSlot",id, slotMap)

	// 	if(slotMap[id]) return slotMap[id]

	// 	if (!id) return null
	// 	for (let index in slots) {
	// 		const slot = slots[index]
	// 		const component = getComponent(slot.type)
	// 		// const index = components.findIndex((x) => x.id === slot.type)

	// 		if (slot.id === id) {
	// 			slot.parent_id = parent?.id ?? null
	// 			slot.parent_field = field
	// 			slot.parent_index = index

	// 			slotMap[id] = slot
	// 			return slot
	// 		}

	// 		for (let field of component.fields) {
	// 			if (field.type === 'slot') {
	// 				const res = findSlot(id, slot.props[field.name] ?? [], field.name, slot)

	// 				if (res) return res
	// 			}
	// 		}
	// 	}
	// 	return null
	// }

	function selectSlot(id) {
		mode = 'options'

		if (!id) {
			mode = 'add'

			activeSlot = null
			activeComponent = null
			borderPosition = {}
		}
		let slotItem = slotMap[id]

		if (slotItem) {
			rightSidebarOpen = true

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
		console.log('moveComponent', slot_id, parent_id, field_name, index)
		const slot = slotMap[slot_id]

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
		console.log(
			'insertComponent',
			getComponent(component_id).name,
			parent_id,
			field_name,
			index,
			props
		)
		let localSlots = JSON.parse(JSON.stringify(slots))

		mode = 'options'

		const id = getId()

		let newSlot = {
			id,
			type: component_id,
			props, // default value
		}

		if (!parent_id) {
			// slots.push(newSlot)
			localSlots = [...localSlots.slice(0, index), newSlot, ...localSlots.slice(index)]
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

		for (let slot of localSlots) {
			findAndInsert(slot)
		}

		slots = localSlots
		console.log('render: insert component...', slots, localSlots)
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
				goto('/edit/' + page.id, { invalidateAll: true })
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
		leftSidebarOpen
		rightSidebarOpen

		setTimeout(() => {
			updateActiveBorder()
		}, 400)
	}

	let loading = true
	onMount(async () => {
		loading = false
		components = await api('/components').then(res => res.data)
		pages = await api('/pages').then(res => res.data)
		assets = await api('/assets').then(res => res.data)
		// assets = await api('/assets').then(res => res.data)

		page = pages.find((x) => x.id === page_id)

		console.log('pages: ', pages)

		for (let component of components) {
			hbsTemplates[component.id] = hbs.compile(component.template)
		}

		console.log('render: on mount')
	})

	$: if (contentEl) {
		render()
		contentEl.addEventListener('scroll', updateActiveBorder)
	}

	function openComponentSettings(component: any) {
		rightOffcanvasOpen = true
		offcanvasMode = 'component-settings'

		activeComponent = component
	}

	async function updateComponent({ detail }: CustomEvent) {
		rightOffcanvasOpen = false
		await fetch(`./components/${detail.id}/?/update`, {
			method: 'POST',
			body: JSON.stringify(detail),
		})
		goto('/edit/' + page.id, { invalidateAll: true })
	}

	async function openAddComponentModal() {
		const value = await modal.open(AddComponentModal, {
			data: {},
		})

		if (value?.name) {
			if (components.map((x) => x.name).includes(value.name)) {
				return
			}

			const newComponent = {
				name: value.name,
				fields: [],
				slot: [],
				raw: false,
				template: '',
			}

			fetch(`/edit/${page.id}/components/?/createComponent`, {
				method: 'POST',
				body: JSON.stringify(newComponent),
			}).then((res) => {
				goto('/edit/' + page.id, { invalidateAll: true })
			})
		}
	}

	async function updateTable() {
		leftOffcanvasOpen = false

		fetch(`/edit/${page.id}/content/?/update`, {
			method: 'POST',
			body: JSON.stringify(activeTable),
		}).then((res) => {
			goto('/edit/' + page.id, { invalidateAll: true })
		})
	}

	async function removeTable() {
		leftOffcanvasOpen = false

		fetch(`/edit/${page.id}/content/?/remove`, {
			method: 'POST',
			body: JSON.stringify(activeTable),
		}).then((res) => {
			goto('/edit/' + page.id, { invalidateAll: true })
		})
	}

	async function updatePage() {
		leftOffcanvasOpen = false

		await onSave()

		// invalidateAll()
		alert.success('page updated!')

		// fetch('?/updatePage', {
		// 	method: 'POST',
		// 	body: JSON.stringify(page),
		// }).then((res) => {
		// })
	}

	function removePage() {
		leftOffcanvasOpen = false

		fetch('?/removePage', {
			method: 'POST',
			body: JSON.stringify(page),
		}).then((res) => goto('/edit', { invalidateAll: true }))
	}

	async function removeComponent({ detail }: CustomEvent) {
		rightOffcanvasOpen = false
		await fetch(`./components/${detail.id}/?/remove`, {
			method: 'POST',
			body: JSON.stringify(detail),
		})
		goto('.', { invalidateAll: true })
	}

	function cancelUpdatePage() {
		leftOffcanvasOpen = false
	}

	function gotoPageEditor(newPage) {
		page = newPage
		slots = newPage.slot

		render()
	}

	async function onUpload({ detail }: CustomEvent) {
		const result = await fetch('./assets?/upload', {
			method: 'POST',
			body: detail,
		}).then((res) => res.json())

		invalidateAll()
	}

	async function removeFile(id: string) {
		await fetch('./assets?/remove', {
			method: 'POST',
			body: JSON.stringify({ id }),
		}).then((res) => res.json())

		await invalidateAll()
	}

	async function updateFile(asset: any) {
		await fetch('./assets?/update', {
			method: 'POST',
			body: JSON.stringify({
				id: asset.id,
				data: asset,
			}),
		}).then((res) => res.json())
		await invalidateAll()
	}

	function openTableData(table) {
		leftOffcanvasOpen = true
		offcanvasMode = 'data-list'
		activeTable = table
		//
	}

	function openTableSettings(table) {
		leftOffcanvasOpen = true
		offcanvasMode = 'table-settings'
		activeTable = table

		//
	}

	$: if (mode === 'add') {
		render()
	}

	let leftSidebarOpen = false
	let rightSidebarOpen = false
</script>

<svelte:head>
	<title>Page Editor | {page.title}</title>
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<script src="/cdn.tailwindcss.com.js"></script>
</svelte:head>

{#if type === 'page'}
	{#if loading}
		<Loading show />
	{:else}
		<div class="page" data-bs-theme="dark" dir="ltr">
			<div
				class="header"
				class:right-sidebar-open={rightSidebarOpen}
				class:left-sidebar-open={leftSidebarOpen}>
				<div class="flex items-center gap-2">
					<HeaderItem
						icon="file"
						on:click={() => {
							leftSidebarOpen = true
							mode = 'list'
						}} />

					<HeaderItem
						icon="database"
						on:click={() => {
							leftSidebarOpen = true
							mode = 'content'
						}} />

					<HeaderItem
						icon="photo"
						on:click={() => {
							leftOffcanvasOpen = true
							offcanvasMode = 'assets'
						}} />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<HeaderItem
						icon="settings"
						on:click={() => {
							offcanvasMode = 'edit'
							leftOffcanvasOpen = true
						}} />
				</div>

				<div class="flex items-center gap-2">
					<HeaderItem on:click={onSave}>
						<Button class="bg-blue-500 h-[24px] px-[8px]" color="primary" size="sm">Save</Button>
					</HeaderItem>
					<HeaderItem>
						{#key page.slug}
							<Button
								href="/{page.slug}"
								class="bg-green-500 h-[24px] px-[8px]"
								color="success"
								target="_blank"
								size="sm">View</Button>
						{/key}
					</HeaderItem>
					<HeaderItem
						icon="category-filled"
						on:click={() => {
							if (rightSidebarOpen && mode === 'options') {
								mode = 'add'
							} else {
								rightSidebarOpen = !rightSidebarOpen
								mode = 'add'
							}
						}} />
				</div>
			</div>
			<EditorOffcanvases
				{tables}
				{forms}
				{components}
				bind:page
				bind:offcanvasMode
				bind:leftOffcanvasOpen
				bind:rightOffcanvasOpen />

			<div class="sidebar-left" class:open={leftSidebarOpen}>
				<div class="h-full w-full relative">
					<Icon
						class="absolute right-2 top-[0.375rem]"
						on:click={() => (leftSidebarOpen = false)}
						name="x" />

					{#if mode === 'content'}
						<SidebarTableList
							{tables}
							on:open-table-settings={(event) => openTableSettings(event.detail)}
							on:open-table-data={(event) => openTableData(event.detail)} />
					{:else}
						<SidebarPageList
							{page}
							{pages}
							on:open-page={(e) => gotoPageEditor(e.detail)}
							on:open-page-settings={() => console.log('settings')} />

						<div class="h-10"></div>
						<SidebarSlotList
							on:open-settings={(e) => selectSlot(e.detail.id)}
							{slots}
							{activeSlot}
							{components} />
					{/if}
				</div>
			</div>

			<div class="sidebar" class:open={rightSidebarOpen}>
				<div class="h-full w-full relative">
					<Icon
						class="absolute left-2 top-[0.375rem]"
						on:click={() => (rightSidebarOpen = false)}
						name="x" />

					<!-- {#if activeSlot && mode === 'options'}
					<El class="sidebar-title">{getComponent(activeSlot.type).name}</El>
				{/if} -->
					<div class="sidebar-body">
						{#if mode === 'add'}
							<El class="sidebar-title">
								Components
								<Icon
									ms="auto"
									on:click={() => openAddComponentModal()}
									name="plus"
									bgColor="primary" />
							</El>

							{#if activeSlot}
								<Button my="2" on:click={() => (mode = 'options')} bgColor="primary"
									>{getComponent(activeSlot.type).name} Options</Button>
							{/if}
							<SidebarComponentList {components} {dragging} />
						{:else if activeSlot}
							<SidebarComponentOption {activeSlot} />
						{/if}
					</div>
				</div>
			</div>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				on:click={() => selectSlot('')}
				bind:this={contentEl}
				class="content"
				data-dropzone
				class:dragging
				class:right-sidebar-open={rightSidebarOpen}
				class:left-sidebar-open={leftSidebarOpen}>
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
						<div style="display: flex; pointer-events: all; z-index: 4">
							<Icon size="1x" on:click={onSelectParent} bgColor="primary" name="arrow-up" />
							<Icon size="1x" on:click={onExtractComponent} bgColor="warning" name="star" />

							<!-- <Icon size="1x" class="handle" bgColor="primary" name="move" /> -->
						</div>

						<div style="pointer-events: all; z-index: 4">
							<Icon size="1x" on:click={() => onRemoveSlot(activeSlot.id)} bgColor="red" name="x" />
						</div>
					</div>
				</div>
			</div>
			<div class="fixed top-0 right-0">
				<AlertProvider alerts={$alert} />
			</div>
			{#if !leftOffcanvasOpen && !rightOffcanvasOpen}
				<ModalProvider />
			{/if}
		</div>
	{/if}
{:else}
	<div>Page or component not found <a href="/edit">Go Back</a></div>
{/if}
