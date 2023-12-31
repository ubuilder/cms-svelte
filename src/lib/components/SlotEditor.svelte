<script lang="ts">
  
  import { createEventDispatcher, onMount } from 'svelte'
  import { DragDrop } from '$lib/helpers/drag-drop'
  import { Icon, Loading, Tooltip, alert, modal } from '@ulibs/yesvelte'
  import { api } from '$lib/helpers/api'
  import { browser } from '$app/environment'
  import AddComponentModal from './components/AddComponentModal.svelte'
  import { getId, renderVariable } from '$lib/helpers'
  import type { DbFilter, DbWith } from '$lib/types'

  export let slotList: any[] = []
  export let components: any[] = []
  export let responsiveMode = '@xl:'
  export let activeSlot: any = null
  export let hbsTemplates: any = {}
  export let slotMap: any = {}

  let contentEl: any
  let dragging = false
  let loading = true
  let borderPosition: any = {}
  let hoverBorderPosition: any = {}
  let instance: any
  let wrapper: HTMLDivElement
  let responsiveWrapper: HTMLDivElement
  
  const dispatch = createEventDispatcher()

  export function removeSlot(id: string) {
    forEachSlot(slotList, (slot: any) => {
      const component = getComponent(slot.type)
      for (let field of component.fields) {
        if (field.type === 'slot' && slot.props[field.name]) {
          slot.props[field.name].slot = (slot.props[field.name].slot ?? []).filter(
            (x) => x.id !== id
          )
        }
      }
    })

    slotList = slotList.filter((x) => x.id !== id)

    // TODO: can be optimized...
    render()

    openComponentList()
    activeSlot = null
    borderPosition = {}
  }

  function openComponentList() {
    selectSlot()
    dispatch('open-component-list')

    // setTimeout(() => {
    // 	render()
    // }, 10)
  }

  export function onSelectParent() {
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
        if (field.type === 'slot' && slot.props[field.name]) {
          const x = (slot.props[field.name].slot ?? []).find((x) => x.id === activeSlot?.id)
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

  async function forEachSlot(slots = [], cb, parent = null) {
    for (let slot of slots) {
      const component = getComponent(slot.type)
      await cb(slot, parent, slots)

      for (let field of component.fields) {
        if (field.type === 'slot') {
          await forEachSlot(slot.props[field.name]?.slot ?? [], cb, slot)
        }
      }
    }
  }

  async function loadDynamicData(slot, items) {
    if (!slot) return
    await forEachSlot([slot], async (slot) => {
      const component = getComponent(slot.type)
      for (let field of component.fields) {
        if (field.type === 'slot' && slot.props[field.name] && slot.props[field.name].name) {
          // Dynamic slot

          const id = slot.props[field.name].name

          const where: DbFilter = {}

          const with_: DbWith = {}

          for (let filter of slot.props[field.name].filters ?? []) {
            where[filter.field] = {
              operator: filter.operator,
              value: renderVariable(filter.value, items),
            }
          }

          if (slot.props[field.name].table) {
            const table = await api('/tables', {
              params: {
                id: `${slot.props[field.name].table}`,
              },
            }).then((res) => res.data)
            // await api("/content/" + slot.props[field.name].table, {
            //   params: {
            //     where: where,
            //     with: with_,
            //     perPage: slot.props[field.name].perPage,
            //     page: slot.props[field.name].page,
            //   }
            // }).then((res) => res.data)

            for (let field of table.fields) {
              if (field.type === 'relation') {
                with_[field.name] = {
                  table: field.table,
                  // field: field.field + '_id', // not working
                  field: 'author' + '_id', // working

                  multiple: field.multiple,
                }
              }
            }

            items[id] = await api(`/content/${slot.props[field.name].table}`, {
              params: {
                where,
                with: with_,
                perPage: slot.props[field.name].perPage,
                page: slot.props[field.name].page,
              },
            }).then((res) => res.data.data)
            if (!slot.props[field.name].multiple) {
              items[id] = items[id][0]
            }
          }
        }
      }
    })
  }

  export async function render(slot = null) {
    console.log("rederfunction", {slot})
    setTimeout(() => {
      if (instance) {
        instance.destroy()

        instance = null
      }

      instance = DragDrop(document.querySelector('.page'), {
        draggable: '[data-draggable]',
        dropzone: '[data-dropzone]',
      })

      instance.on('start', (event) => {
        dragging = true
      })

      instance.on('return', (event) => {
        dragging = false
      })

      instance.on('drop', (event) => {
        dragging = false

        const target = event.target
        const source = event.source.dataset.id.split('-')[1]

        if (target) {
          const parent = target.getAttribute('data-parent')
          const field = target.getAttribute('data-field')
          const index = +target.getAttribute('data-index')

          if (parent === source) return

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
      if (browser) {
        console.log(`render(${slot.id})`)

        const a = document.querySelector(`[id="component-${slot.id}"]`)
        if (a) {
          a.outerHTML = await renderSlot(
            slot,
            slot.parent_id ?? '',
            slot.parent_field ?? '',
            slot.parent_index ?? 0,
            false,
            {}
          ) // without placeholder
        }
      }
    } else {

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
      const items = {}
      let html = ''
      for (let index in slotList) {
        const slotItem = slotList[index]
        html += placeholder('', '', index, 'h-4')
        html += await renderSlot(slotItem, '', '', +index, false, items)
      }
      html += placeholder('', '', slotList.length, 'empty')

      contentEl.innerHTML = html
    }

    updateActiveBorder()
  }

  async function renderSlot(
    slot: any,
    parent_id: string = '',
    parent_field = '',
    parent_index = 0,
    withPlaceholder = true,
    items: any = {}
  ) {
    let props: any = {}

    await loadDynamicData(slot, items)
    const component = getComponent(slot.type)
    const id = slot.id ?? getId()

    slot.parent_id = parent_id
    slot.parent_field = parent_field
    slot.parent_index = parent_index

    slotMap[id] = slot

    if (component?.raw) {
      for (let index in component.fields) {
        const field = component.fields[index]

        if (field.type === 'slot') {
          let content = ''
          if (slot.props?.[field.name]?.name) {
            if (items[slot.props[field.name].name]) {
              if (Array.isArray(items[slot.props[field.name].name] ?? [])) {
                // multiple
                if (items[slot.props[field.name].name].length) {
                  for (let item of items[slot.props[field.name].name] ?? []) {
                    //
                    for (let index in slot.props?.[field.name]?.slot ?? []) {
                      const x = slot.props[field.name]?.slot[index]

                      const res = await renderSlot(x, id, field.name, +index, true, {
                        ...items,
                        [slot.props[field.name].name]: item,
                      })
                      content += res
                    }
                  }
                } else {
                  content = 'Empty'
                }
              } else {
                //
                for (let index in slot.props?.[field.name]?.slot ?? []) {
                  const x = slot.props[field.name]?.slot[index]

                  const res = await renderSlot(x, id, field.name, +index, true, {
                    ...items,
                    [slot.props[field.name].name]: items[slot.props[field.name].name],
                  })
                  content += res
                }
              }
            } else {
              content = `No Data (${slot.props[field.name].name})`
            }

            if (content) {
              props[
                field.name
              ] = `<div class="slot" data-dynamic data-parent="${id}" data-index="0">${
                renderVariable(content, items) +
                placeholder(id, field.name, slot.props?.[field.name].length)
              }</div>`
            } else {
              props[field.name] = placeholder(id, field.name, 0, 'empty')
            }
          } else {
            for (let index in slot.props?.[field.name]?.slot ?? []) {
              
              const x = slot.props[field.name]?.slot[index]

              const res = await renderSlot(x, id, field.name, +index, true, items)
              content += res
            }

            if (content) {
              props[field.name] = `<div class="slot" data-parent="${id}" data-index="0">${
                renderVariable(content, items) +
                placeholder(id, field.name, slot.props?.[field.name]?.slot?.length)
              }</div>`
            } else {
              props[field.name] = placeholder(id, field.name, 0, 'empty')
            }
          }
        } else {
          props[field.name] = renderVariable(slot.props[field.name], items)
        }
      }

      props['Class'] = slot.props['Class'] ?? ''
      props['Attributes'] = slot.props['Attributes'] ?? ''

      if (hbsTemplates[slot.type]) {
        setTimeout(() => {
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

    // return component.slot
    //   .map((x) => {
    //     console.log('renderSlot: render custom component...')
    //     return renderSlot(x).replace(/placeholder\ empty/g, '')
    //   })
    //   .join('')

    return 'TODO (raw = false)'
  }

  const placeholder = (parent: string, field: string = '', index: number = 0, className = '') =>
    `<span class="placeholder ${className}" data-dropzone data-parent="${parent}" data-index="${index}" data-field="${field}"></span>`
  let html = ''

  export function updateActiveBorder() {
    hoverBorderPosition = {}
    if (!activeSlot) return

    setTimeout(() => {
      const rects = document
        .querySelector('#component-' + activeSlot?.id)
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
  let clipboardSlot: any = null

  async function getClipboardSlot() {
    const text = navigator.clipboard.readText? await navigator.clipboard.readText(): ""
    if (text) {
      try {
        const obj = JSON.parse(text)

        if (getComponent(obj.type)) {
          clipboardSlot = obj
        }
      } catch (err) {
        // skip
      }
    }
  }

  function initialRender() {
    if (contentEl && slotList) {
      render()
    } else {
      setTimeout(initialRender, 100)
    }
  }

  onMount(() => {
    getClipboardSlot()
    initialRender()
    makeResizeable()
  })

  $: if (contentEl && slotList) {
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

      // const slot = activeSlot.

      const newComponent = {
        name: value.name,
        fields: [],
        raw: false,
        slot: [{ type: activeSlot.type, props: activeSlot.props }],
      }

      api('/components', { data: newComponent }).then((res) => {
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
      activeSlot = slotItem
      dispatch('open-component-options', slotItem)
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
    let localSlots = JSON.parse(JSON.stringify(slotList))

    const defaultProps: any = {}
    for (let field of getComponent(component_id).fields ?? []) {
      defaultProps[field.name] = field.default_value
    }

    const id = getId()

    let newSlot = {
      id,
      type: component_id,
      props: { ...defaultProps, ...props }, // default value
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
          slot.props[field.name] ??= { slot: [] }

          if (index === 0) {
            slot.props[field.name].slot.unshift(newSlot)
          } else {
            slot.props[field.name].slot = [
              ...slot.props[field.name].slot.slice(0, index),
              newSlot,
              ...slot.props[field.name].slot.slice(index),
            ]
          }
          setTimeout(() => {
            selectSlot(id)
          }, 1)
        } else if (field.type === 'slot') {
          for (let subSlot of slot.props[field.name]?.slot ?? []) {
            findAndInsert(subSlot)
          }
        }
      }
    }

    for (let slot of localSlots) {
      findAndInsert(slot)
    }

    slotList = localSlots
    render()
  }

  function onCopy() {
    const result = JSON.parse(JSON.stringify([activeSlot]))

    forEachSlot(result, (slot) => {
      delete slot['id']
      delete slot['parent_id']
      delete slot['parent_field']
      delete slot['parent_index']
    })

    navigator.clipboard.writeText(JSON.stringify(result[0]))
    setTimeout(() => {
      getClipboardSlot()
    }, 1)
  }

  function paste() {
    const slot = clipboardSlot

    const nextPlaceholder = document.getElementById(
      'component-' + activeSlot.id
    )?.nextElementSibling

    const field = nextPlaceholder.dataset.field
    const index = +nextPlaceholder.dataset.index
    const parent = nextPlaceholder.dataset.parent

    insertComponent(slot.type, parent, field, index, slot.props)
  }

  let controler: HTMLDivElement
  let width = '100%'
  let left = '100%'
  $: setWidth(responsiveMode)
  function setWidth() {
    width = '100%'
    left = '100%'
  }

  function makeResizeable() {
    const widthsMap = {
      '@xs:': [200, 480],
      '@sm:': [481, 640],
      '@md:': [641, 768],
      '@lg:': [769, 1024],
      '@xl:': [1025, 10280],
    }
    controler.addEventListener('mousedown', (e) => {
      wrapper.addEventListener('mousemove', resize)
    })
    wrapper.addEventListener('mouseup', (e) => {
      wrapper.removeEventListener('mousemove', resize)
    })
    wrapper.addEventListener('mouseleave', (e) => {
      wrapper.removeEventListener('mousemove', resize)
    })
    function resize(e) {
      if (left.endsWith('px')) {
        let x = left
        x.replace('px', '')
        x = Number.parseFloat(x)
        if (
          x <= widthsMap[responsiveMode][0] &&
          x >= e.pageX - responsiveWrapper.getBoundingClientRect().left
        ){
          width = widthsMap[responsiveMode][0] + "px"
          left = width
          return
        }
        if (
          x >= widthsMap[responsiveMode][1] &&
          x <= e.pageX - responsiveWrapper.getBoundingClientRect().left
        ){
          width = widthsMap[responsiveMode][1] + "px"
          left = width
          return

        }
      }
      width = e.pageX - responsiveWrapper.getBoundingClientRect().left + 'px'
      left = width
    }
  }

</script>

<div
  style="margin-left: auto;margin-right: auto;width: 100%; height: 100%;position:relative;display:flex; justify-content:center"
  bind:this={wrapper}>
  <div 
  class = '@container'
  bind:this = {responsiveWrapper}
  style="height: 100%; width: {width}; display:flex;position:relative"
  class:sm={responsiveMode == '@sm:'}
  class:md={responsiveMode == '@md:'}
  class:lg={responsiveMode == '@lg:'}
  >
    <div
      id="content-el"
      bind:this={contentEl}
      on:click={() => openComponentList()}
      class="content"
      style = 'width:100%'
      data-dropzone
      class:dragging>
      
    </div>
    <div style="left: {left}" class="controler" bind:this={controler}></div>
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
          on:click={() => onCopy()}
          bgColor="primary"
          name="copy" />
        <Tooltip placement="top">Copy</Tooltip>

        {#if clipboardSlot}
          <Icon
            class="p-0.5"
            size="lg"
            color="light"
            on:click={() => paste()}
            bgColor="primary"
            name="clipboard" />
          <Tooltip placement="top">Paste</Tooltip>
        {/if}

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

<style>
  .xs {
    max-width: 480px;
  }
  .sm {
    max-width: 640px;
  }
  .md {
    max-width: 768px;
  }
  .lg {
    max-width: 1024px;
    /* min-width: 768px; */
  }
  .xl {
    max-width: 50000px;
    /* min-width: 1024px; */
  }
  .controler {
    background-color: rgb(92, 92, 92);
    width: 10px;
    cursor: ew-resize;
    height: 200px;
    position: absolute;
    top: 12px;
    margin-left: -4px;
  }
  .controler:hover {
    background-color: rgb(119, 192, 255);
  }
</style>
