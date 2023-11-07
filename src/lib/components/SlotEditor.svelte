<script lang="ts">
	import { customAlphabet } from 'nanoid'
	import { createEventDispatcher } from 'svelte'

	export let slotList: any[] = []

	let contentEl: any

	let activeSlot: any = null

	let borderPosition: any = {}
	let hoverBorderPosition: any = {}
	let components = []

	const slotMap: any = {}

	function nanoid() {
		return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
	}

	function getId() {
		return nanoid()()
	}

	function onRemoveSlot(id: string) {
		slotList = slotList.filter((x) => x.id !== id)

		forEachSlot(slotList, (slot: any) => {
			const component = getComponent(slot.type)
			for (let field of component.fields) {
				if (field.type === 'slot') {
					slot.props[field.name] = (slot.props[field.name] ?? []).filter((x) => x.id !== id)
				}
			}
		})

		// TODO: can be optimized...
		render()

		const dispatch = createEventDispatcher()
		dispatch('open-component-list')
		activeSlot = null
		borderPosition = {}
	}

	function onSelectParent() {
		const slot = slotList.find((x) => x.id === activeSlot.id)
		// if (slot) {
		// 	mode = 'add'
		// 	activeSlot = null
		// 	borderPosition = {}
		// 	return
		// }

		forEachSlot(slotList, (slot) => {
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

	function render(slot = null) {
		if (!page) return
		if (false) {
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
				slotList.map((x, i) => renderSlot(x, '', '', i)).join('') +
				placeholder('', '', slotList.length, 'h-full')

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

	const placeholder = (parent: string, field: string = '', index: number = 0, className = '') =>
		`<span class="placeholder ${className}" data-dropzone data-parent="${parent}" data-index="${index}" data-field="${field}"></span>`
	let html = ''

	function forEachSlot(slots: any[] = [], cb, parent = null) {
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

	export function updateActiveBorder() {
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

	$: if (contentEl && page) {
		render()
		contentEl.addEventListener('scroll', updateActiveBorder)
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

			api('/components', { data: newComponent }).then((res) => {
				console.log('update slot....')
				reload(['components'])
			})
		}
	}

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
		let localSlots = JSON.parse(JSON.stringify(slotList))

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

		slotList = localSlots
		console.log('render: insert component...', slotList, localSlots)
		render()
	}
</script>

<div>
	<div bind:this={contentEl} class="content" data-dropzone class:dragging></div>

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
</div>
