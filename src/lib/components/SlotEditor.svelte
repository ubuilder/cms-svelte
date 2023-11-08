<script lang="ts">
  import hbs from 'handlebars'
  import { customAlphabet } from 'nanoid'
  import { createEventDispatcher, onMount } from 'svelte'
  import { DragDrop } from '$lib/helpers/drag-drop'
  import { Icon, Loading, Tooltip, alert, modal } from '@ulibs/yesvelte'
  import { api } from '$lib/helpers/api'
  import { browser } from '$app/environment'
  import AddComponentModal from './components/AddComponentModal.svelte'

  export let slotList: any[] = []

  let contentEl: any

  let activeSlot: any = null
  let dragging = false
  let loading = true

  let borderPosition: any = {}
  let hoverBorderPosition: any = {}
  export let components: any[] = []

  let instance: any

  export let hbsTemplates: any = {}
  const slotMap: any = {}

  const dispatch = createEventDispatcher()

  function nanoid() {
    return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
  }

  function getId() {
    return nanoid()()
  }

  export function removeSlot(id: string) {
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

    openComponentList()
    activeSlot = null
    borderPosition = {}
  }

  function openComponentList() {
    selectSlot()
    console.log('open component list')
    dispatch('open-component-list')

    // setTimeout(() => {
    // 	render()
    // }, 10)
  }

  function onSelectParent() {
    const slot = slotList.find((x) => x.id === activeSlot?.id)
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
          const x = (slot.props[field.name] ?? []).find((x) => x.id === activeSlot?.id)
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

  export function render(slot = null) {
    setTimeout(() => {
      console.log('initialize draggable')
      if (instance) {
        instance.destroy()

        instance = null
      }

      instance = DragDrop(document.querySelector('.page'), {
        draggable: '[data-draggable]',
        dropzone: '[data-dropzone]',
      })

      instance.on('start', (event) => {
        console.log('dragging started ', event)
        dragging = true
        event.source.classList.add('active-slot')
      })

      instance.on('return', (event) => {
        dragging = false
        event.source.classList.remove('active-slot')
      })

      instance.on('drop', (event) => {
        dragging = false
        event.source.classList.remove('active-slot')

        const target = event.target
        const source = event.source.dataset.id.split('-')[1]

        console.log({ target, source: event.source })

        if (target) {
          const parent = target.getAttribute('data-parent')
          const field = target.getAttribute('data-field')
          const index = +target.getAttribute('data-index')

          if (parent === source) return

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
      })
    }, 5)

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
      setTimeout(() => {
        document.querySelectorAll('.placeholder.empty').forEach((el) => {
          el.onclick = (e) => {
            e.stopPropagation()
            setTimeout(() => {
              openComponentList()
            })
          }
        })
      })
      html =
        slotList.map((x, i) => renderSlot(x, '', '', i)).join('') +
        placeholder('', '', slotList.length, 'empty')

      contentEl.innerHTML = html
    }

    updateActiveBorder()
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
            content += res
          }

          if (content) {
            props[field.name] =
              `<div class="slot" data-parent="${id}" data-index="0">${content}</div>` +
              placeholder(id, field.name, +index + 1)
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
          console.log('here')
          document.querySelector(`[data-parent="${id}"]`)?.addEventListener('click', (e) => {
            e.stopPropagation()

            selectSlot(id)
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
      } else {
        return 'ERROR'
      }
    }
    if (!component) return 'todo'

    if (component.raw) return ''
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

  $: if (contentEl && slotList) {
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
        raw: false,
        slot: [{ type: activeSlot.type, props: activeSlot.props }],
      }

      console.log({ newComponent })

      api('/components', { data: newComponent }).then((res) => {
        console.log('update slot....')
        alert.success(res.message)
        dispatch('reload', ['components'])
      })
    }
  }

  export function selectSlot(id: string = '') {
    if (!id) {
      activeSlot = null
      borderPosition = {}
    }
    let slotItem = slotMap[id]

    if (slotItem) {
      dispatch('open-component-options', slotItem)

      activeSlot = slotItem

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
    if (activeSlot && components) {
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
    removeSlot(slot.id)
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

    const defaultProps: any = {}
    for (let field of getComponent(component_id).fields ?? []) {
      console.log({ field })
      defaultProps[field.name] = field.default_value
    }

    const id = getId()

    let newSlot = {
      id,
      type: component_id,
      props: { ...defaultProps, props }, // default value
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

<div style="width: 100%; height: 100%">
    <div
      bind:this={contentEl}
      on:click={() => openComponentList()}
      class="content"
      data-dropzone
      class:dragging>
    </div>
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
        <Icon
          class="p-0.5"
          size="lg"
          color="light"
          on:click={onSelectParent}
          bgColor="primary"
          name="arrow-up" />
        <Tooltip placement="top">Select Parent</Tooltip>
        <Icon
          class="p-0.5"
          size="lg"
          color="light"
          data-draggable
          data-id="component-{activeSlot?.id}"
          bgColor="primary"
          name="arrows-move" />
        <Tooltip placement="top">Move</Tooltip>

        <Icon
          class="p-0.5"
          size="lg"
          color="light"
          on:click={onExtractComponent}
          bgColor="warning"
          name="star" />
        <Tooltip placement="top">Extract component</Tooltip>
      </div>

      <div style="pointer-events: all; z-index: 4">
        <Icon
          class="p-0.5"
          size="lg"
          color="light"
          on:click={() => removeSlot(activeSlot?.id)}
          bgColor="red"
          name="x" />
      </div>
    </div>
  </div>
</div>
