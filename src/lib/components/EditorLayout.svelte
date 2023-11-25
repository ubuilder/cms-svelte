<script lang="ts">
  import EditorOffcanvases from './EditorOffcanvases.svelte'
  import containerQuery from '@tailwindcss/container-queries'
  import hbs from 'handlebars'
  import '@ulibs/yesvelte/styles.css'
  import './Editor.css'
  import { onMount, tick } from 'svelte'
  import {
    AlertProvider,
    Button,
    Icon,
    ModalProvider,
    alert,
    Dropdown,
    Avatar,
    DropdownMenu,
    DropdownItem,
  } from '@ulibs/yesvelte'

  import SidebarTableList from './SidebarTableList.svelte'
  import Loading from './Loading.svelte'
  import SidebarPageList from './SidebarPageList.svelte'
  import { api } from '$lib/helpers/api'
  import SidebarSlotList from './SidebarSlotList.svelte'
  import SidebarComponentList from './SidebarComponentList.svelte'
  import SidebarComponentOption from './SidebarComponentOption.svelte'
  import HeaderItem from './HeaderItem.svelte'
  import { t } from '$lib/i18n'
  import SlotEditor from './SlotEditor.svelte'
  import { goto } from '$app/navigation'
  import { driver } from "driver.js";
  import "driver.js/dist/driver.css";
function startTour(){
  const driverObj = driver({
    popoverClass: 'navigator-popover-class',
    showProgress: true,
    steps: [
      { element: '.nothing', popover: { title: 'Wellcom to UBuilder CMS', description: 'Ubuilder CMS is an opensource CMS, the main goal of Ubuilder is to bring simplicity to no code web development' } },
      { element: '.nothing', popover: { title: 'You can use arrow keys', description: 'You can use left and right arrow key to navigate between steps' } },
      { element: '#main-sections', popover: { title: 'Main Sections', description: 'Provides you with the main sections of CMS' } },
      { element: '.pages-button', popover: { title: 'Pages', description: 'You can View and manage pages' } },
      { element: '.assets-button', popover: { title: 'Database', description: 'You can View and manage Data' } },
      { element: '.databases-button', popover: { title: 'Assets', description: 'You can upload and manage your assets and files' } },
      { element: '.responsive-section', popover: { title: 'Responsive Design', description: 'You can make different designs for different screen sizes and devices' } },
      { element: '.xl-responsive-mode', popover: { title: 'Desktop', description: 'This is the default design size whick applyes to all screen sizes' } },
      { element: '.sm-responsive-mode', popover: { title: 'Mobile', description: 'This is the smalles screen size which is good for different mobile screens' } },
      { element: '.components-section', popover: { title: 'Components', description: 'Your Can Open list of Components to start design with.' } },
      { element: '.nothing', popover: { title: 'Ready to go!', description: 'Good luck with your journy of creating your dream pages with UBuilder CMS' } },
    ]
  });
  setTimeout(()=>{
    driverObj.drive();
  }, 3000)
  return driverObj
}
$:if(!loading){startTour()}


  let editor: any

  let components: any[] = []

  let user = {}
  let pages: any[] = []
  let tables: any[] = []
  let settings = {}

  export let page_id: any = undefined
  export let component_id: any = undefined
  export let redirectTo: any = undefined

  export let theme: 'light' | 'dark' = 'light'
  export let dir: 'ltr' | 'rtl' = 'ltr'

  let mode: string = component_id ? 'component' : 'page'

  let hasChanges = true

  let page: any = null
  let component: any = null

  let activeSlot: any = null

  let leftSidebarMode = ''
  let rightSidebarMode = ''

  let offcanvasMode: string | undefined = undefined
  let offcanvasData = {}

  const hbsTemplates: any = {}

  let responsiveMode = '@xl:'

  let leftOffcanvasOpen = false
  let rightOffcanvasOpen = false

  function getComponent(id: string) {
    return components.find((x) => x.id === id)
  }

  function forEachSlot(slots = [], cb, parent = null) {
    for (let slot of slots) {
      const component = getComponent(slot.type)
      cb(slot, parent, slots)

      for (let field of component.fields) {
        if (field.type === 'slot') {
          forEachSlot(slot.props[field.name]?.slot ?? [], cb, slot)
        }
      }
    }
  }

  async function onSave() {
    if (mode === 'page') {
      onSavePage()
    } else {
      onSaveComponent()
    }
  }
  async function onSaveComponent() {
    const result = JSON.parse(JSON.stringify(component))

    forEachSlot(result.slot, (slot) => {
      delete slot['id']
      delete slot['parent_id']
      delete slot['parent_field']
      delete slot['parent_index']
    })

    await api('/components', {
      params: {
        id: result.id,
      },
      data: result,
    }).then((res) => {
      goto(redirectTo)
      alert.success(res.message)
    })
  }
  async function onSavePage() {
    const result = JSON.parse(JSON.stringify(page))

    forEachSlot(result.slot, (slot) => {
      delete slot['id']
      delete slot['parent_id']
      delete slot['parent_field']
      delete slot['parent_index']
    })

    await api('/pages', {
      params: {
        id: result.id,
      },
      data: result,
    }).then((res) => alert.success(res.message))
  }

  function openPageSettings(page: any) {
    offcanvas.openLeft('edit-page', {
      activePage: page,
    })
  }

  $: page = pages.find((x) => x.id === page_id) ?? null
  $: component = components.find((x) => x.id === component_id) ?? null

  $: if (page) {
    forEachSlot(page.slot, (slot) => {
      if (Array.isArray(slot)) {
        slot = {
          slot,
        }
      }
    })
  }

  $: {
    leftSidebarOpen
    rightSidebarOpen

    setTimeout(() => {
      editor?.updateActiveBorder()
    }, 400)
  }

  let loading = true

  async function reload(event: CustomEvent<string[]> | string[] | null = null) {
    console.log("reload called")
    if (event) {
      const items: string[] = Array.isArray(event) ? event : event.detail

      if (items.includes('components')) {
        components = await api('/components').then((res) => res.data)
        for (let component of components) {
          hbsTemplates[component.id] = hbs.compile(component.template)
        }
      }
      if (items.includes('pages')) {
        pages = await api('/pages').then((res) => res.data)
      }
      if (items.includes('tables')) {
        tables = await api('/tables').then((res) => res.data)
      }
    } else {
      components = await api('/components').then((res) => res.data)
      pages = await api('/pages').then((res) => res.data)
      settings = await api('/settings').then((res) => res.data)
      tables = await api('/tables').then((res) => res.data)

      for (let component of components) {
        hbsTemplates[component.id] = hbs.compile(component.template)
      }
    }
  }

  onMount(async () => {
    await reload()
    loading = false
  })

  async function openComponentEditor(component: any) {
    // activeComponent = component
    await onSave()
    goto(`/edit/${page_id ?? '_'}/component/${component.id}`)
    // console.log(activeComponent)
  }

  function openComponentSettings(component: any) {
    offcanvas.openRight('component-settings', {
      activeComponent: component,
    })
  }

  function gotoPageEditor(newPage: any) {
    reload()
    page_id = newPage.id

    window.history.pushState({}, '', '/edit/' + page_id)
    editor?.render()
  }
  function openTableCreate() {
    offcanvas.openLeft('table-create')
  }

  function openTableData(table: any) {
    offcanvas.openLeft('data-list', {
      activeTable: table,
    })
  }

  function openTableSettings(table: any) {
    offcanvas.openLeft('table-settings', {
      activeTable: table,
    })
  }

  const offcanvas = {
    openLeft(mode: string, data: any = {}) {
      leftOffcanvasOpen = true
      offcanvasData = data
      offcanvasMode = mode
    },
    openRight(mode: string, data: any = {}) {
      rightOffcanvasOpen = true
      offcanvasData = data
      offcanvasMode = mode
    },
    close() {
      leftOffcanvasOpen = false
      rightOffcanvasOpen = false
    },
  }

  $: if (rightSidebarMode === 'add') {
    // enable drag and drop for components in sidebar
    editor?.render()
  }

  $: if (page) {
    function findAndReplace(list) {
      for (let slot of list) {
        const component = getComponent(slot.type)
        for (let field of component.fields) {
          if (field.type === 'slot') {
            if (Array.isArray(slot.props[field.name] ?? [])) {
              findAndReplace(slot.props[field.name] ?? [])

              slot.props[field.name] = {
                slot: slot.props[field.name] ?? [],
              }
            }
          }
        }
      }
    }
    findAndReplace(page.slot)
  }

  let leftSidebarOpen = false
  let rightSidebarOpen = false

  function getGlobalItems() {
    let params = page.slug?.match(/\{\w+\}/g)
    return {
      page: {
        text: 'Page',
        type: 'object',
        content: {
          slug: {
            text: "Page's Slug",
            type: 'plain_text',
          },
          params: {
            type: 'object',
            text: "Page's URL params",
            content: params?.reduce((prev, curr) => {
              const key = curr.substring(1, curr.length - 1)
              return {
                ...prev,
                [key]: {
                  text: "Page's param (" + key + ')',
                  type: 'plain_text',
                },
              }
            }, {}),
          },
          title: {
            text: "Page's Title",
            type: 'plain_text',
          },
          description: {
            text: "Page's Description",
            type: 'plain_text',
          },
        },
      },
    }
  }

  let slotMap: any = {}
  function getParentItems(parent_id: any): any {
    const slot = slotMap[parent_id]
    let items = {}
    if (slot?.parent_id) {
      items = getParentItems(slot.parent_id)
    } else {
      items = getGlobalItems()
    }

    if (!slot) return items
    const component = getComponent(slot.type)

    for (let field of component.fields) {
      if (field.type === 'slot') {
        const options = slot.props[field.name]

        let fields = {}
        const table = tables.filter((table) => table.id == options.table)[0]
        for (let field of table?.fields ?? []) {
          fields[field.name] = {
            text: `${options.name}'s ${field.name}`,
            type: field.type,
          }
        }

        items[options.name] = {
          type: 'object',
          content: fields,
        }
      }
    }

    return items
  }
  function getItems(slot: any): any {
    let items = getParentItems(activeSlot.parent_id)

    // for (let item of load) {

    // 	const table = tables.find((x) => x.id === item.table)
    // 	if (!table) continue

    // 	const fields: any = {}
    // 	fields.id = {
    // 		text: 'ID',
    // 		type: 'plain_text'
    // 	}
    // 	for (let field of table.fields) {
    // 		fields[field.name] = {
    // 			text: `${item.name}'s ${field.name}`,
    // 			type: field.type,
    // 		}

    // 		if (field.type === 'relation') {
    // 			const otherTable = tables.find((x) => x.id === (field as FieldRelation).table)
    // 			const otherFields: any = {}
    // 			for (let otherField of otherTable.fields) {
    // 				otherFields[otherField.name] = {
    // 					text: `${item.name} ${field.name} ${otherField.name}`,
    // 					type: otherField.type,
    // 				}
    // 			}

    // 			fields[field.name].content = otherFields
    // 			fields[field.name].type = field.multiple ? 'array' : 'object'
    // 		}

    // 		if (field.type === 'image' || field.type === 'file') {
    // 			// alt, url, caption from assets....
    // 		}
    // 	}

    // 	items[item.name] = {
    // 		type: item.multiple ? 'array' : 'object',
    // 		text: item.name,
    // 		content: fields,
    // 	}
    // }

    return items
  }
</script>

<svelte:head>
  <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
  <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
  <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script> -->
  <!-- <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css"/>
<script>
  setTimeout(()=>{
    
    const driver = window.driver.js.driver;
    const driverObj = driver();
    driverObj.highlight({
      element: "#main-sections",
      popover: {
        title: "Title",
        description: "Description"
      }
    });
  }, 10000)
</script> -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- <script  src="/cdn.tailwindcss.com.js"></script> -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#da373d',
          }
        }
      }
    }
  </script>
  <script  src="/containerQuery.js"></script>

  {#if page}
    {@html page?.head}
  {/if}
  <title>{page?.title ? `${page.title} | UBuilder CMS` : 'UBuilder CMS'}</title>
</svelte:head>
<Loading show={loading} />

{#if !loading}
  <div class="page" data-bs-theme={theme} {dir}>
    <div
      class="header"
      class:right-sidebar-open={rightSidebarOpen}
      class:left-sidebar-open={leftSidebarOpen}>
      <div id = "main-sections" class="main-sections flex items-center gap-2">
        {#if mode === 'page'}
          <HeaderItem
          class = 'pages-button'
             
            icon="file"
            on:click={() => {
              leftSidebarOpen = true
              leftSidebarMode = 'list'
            }} />
          <HeaderItem class = 'assets-button' icon="photo" on:click={() => offcanvas.openLeft('assets')} />

          <HeaderItem
            class = 'databases-button'
            icon="database"
            on:click={() => {
              leftSidebarOpen = true
              leftSidebarMode = 'content'
            }} />
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
      </div>
      <div  class="responsive-section flex items-center gap-2">
        <HeaderItem
        class = "xl-responsive-mode"
          icon="device-desktop"
          active={responsiveMode == '@xl:'}
          on:click={() => {
            responsiveMode = '@xl:'
          }} />
        <HeaderItem
          active={responsiveMode == '@lg:'}
          icon="device-ipad-horizontal"
          on:click={() => {
            responsiveMode = '@lg:'
          }} />

        <HeaderItem
          icon="device-tablet"
          active={responsiveMode == '@md:'}
          on:click={() => {
            responsiveMode = '@md:'
          }} />
        <HeaderItem
        class = 'sm-responsive-mode'
          icon="device-mobile"
          active={responsiveMode == '@sm:'}
          on:click={() => {
            responsiveMode = '@sm:'
          }} />
      </div>

      <div class="flex items-center gap-2">
        {#if mode === 'component'}
          <HeaderItem>
            <Button href={redirectTo} class="bg-gray-200 h-[24px] px-[8px]" size="sm">Back</Button>
          </HeaderItem>
          {#if hasChanges}
            <HeaderItem on:click={onSaveComponent}>
              <Button class="bg-blue-500 h-[24px] px-[8px]" color="primary" size="sm">Save</Button>
            </HeaderItem>
          {/if}
        {/if}

        {#if mode === 'page'}
          {#if page}
            {#if hasChanges}
              <HeaderItem on:click={onSave}>
                <Button class="bg-blue-500 h-[24px] px-[8px]" color="primary" size="sm"
                  >Save</Button>
              </HeaderItem>
            {/if}
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
          {/if}
        {/if}
        <HeaderItem>
          <Dropdown autoClose arrow={false} placement="bottom-end">
            <Avatar slot="target" size="xs" shape="circle" color="primary">
              {#if user.profile}
                <img alt="profile" src="/files/{user.profile}" />
              {:else}
                <img alt="profile" src="/images/avatar.png" />
              {/if}
            </Avatar>
            <DropdownMenu>
              <DropdownItem on:click={() => offcanvas.openLeft('profile')}>
                {t('profile.title')}
              </DropdownItem>
              <DropdownItem on:click={() => offcanvas.openLeft('settings')}>
                {t('settings.title')}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="/edit/logout">{t('layout.logout')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!--  -->
        </HeaderItem>
        <HeaderItem
        class = 'components-section'
          icon="category-filled"
          on:click={() => {
            if (rightSidebarOpen && rightSidebarMode === 'options') {
              rightSidebarMode = 'add'
            } else {
              rightSidebarOpen = !rightSidebarOpen
              rightSidebarMode = 'add'
            }
          }} />
      </div>
    </div>

    <EditorOffcanvases
      on:reload={reload}
      bind:data={offcanvasData}
      bind:offcanvasMode
      bind:leftOffcanvasOpen
      bind:rightOffcanvasOpen />

    {#if !component_id}
      <div class="sidebar-left" class:open={leftSidebarOpen}>
        <div class="h-full w-full relative">
          <Icon
            class="sidebar-close-icon right"
            on:click={() => (leftSidebarOpen = false)}
            name="x" />

          {#if leftSidebarMode === 'content'}
            <SidebarTableList
              {tables}
              on:reload={reload}
              on:open-table-settings={(event) => openTableSettings(event.detail)}
              on:open-table-create={openTableCreate}
              on:open-table-data={(event) => openTableData(event.detail)} />
          {:else}
            <SidebarPageList
              on:reload={reload}
              {settings}
              {page}
              {pages}
              on:open-page={(e) => gotoPageEditor(e.detail)}
              on:open-page-settings={(e) => openPageSettings(e.detail)} />

            <div class="h-10"></div>
            {#if page}
              <SidebarSlotList
                on:reload={reload}
                on:remove-slot={(e) => editor?.removeSlot(e.detail.id)}
                on:open-settings={(e) => editor?.selectSlot(e.detail.id)}
                slots={page.slot}
                {activeSlot}
                {components} />
            {/if}
          {/if}
        </div>
      </div>
    {/if}

    <div class="sidebar" class:open={rightSidebarOpen}>
      <div class="h-full w-full relative">
        <Icon
          class="sidebar-close-icon left"
          on:click={() => (rightSidebarOpen = false)}
          name="x" />

        <!-- {#if activeSlot && mode === 'options'}
					<El class="sidebar-title">{getComponent(activeSlot.type).name}</El>
				{/if} -->
        {#if rightSidebarMode === 'add'}
          <SidebarComponentList
            on:reload={reload}
            on:open-component-editor={(e) => openComponentEditor(e.detail)}
            on:open-component-settings={(e) => openComponentSettings(e.detail)}
            bind:activeSlot
            bind:mode={rightSidebarMode}
            {components} />
        {:else if activeSlot}
          <SidebarComponentOption
            {components}
            {tables}
            bind:responsiveMode
            bind:activeSlot
            items={getItems(activeSlot)}
            on:open-component-settings={(e) => openComponentSettings(e.detail)}
            on:select-slot={(e) => editor.selectSlot(e.detail)}
            on:select-parent={() => editor.onSelectParent()}
            on:reload={reload}
            on:update={(e) => {
              editor.render(e.detail)
              reload(['components'])
            }} />
        {/if}
      </div>
    </div>

    <div
      class="wrapper bg-gradient-to-tr from-blue-200 to-emerald-200"
      class:right-sidebar-open={rightSidebarOpen}
      class:left-sidebar-open={leftSidebarOpen}>
      {#if page}
        <SlotEditor
          bind:slotMap
          {responsiveMode}
          {components}
          {hbsTemplates}
          bind:this={editor}
          on:open-component-list={() => {
            rightSidebarMode = 'add'
            rightSidebarOpen = true
          }}
          on:open-component-options={(e) => {
            rightSidebarMode = 'options'
            rightSidebarOpen = true
            // activeSlot = e.detail
          }}
          bind:activeSlot
          bind:slotList={page.slot} />
      {:else if mode === 'component' && component}
        <SlotEditor
          components={components.filter((x) => x.id !== component.id)}
          {hbsTemplates}
          bind:this={editor}
          on:open-component-list={() => {
            rightSidebarMode = 'add'
            rightSidebarOpen = true
          }}
          on:open-component-options={(e) => {
            rightSidebarMode = 'options'
            rightSidebarOpen = true
            activeSlot = e.detail
          }}
          bind:slotList={component.slot} />
      {:else}
        <div class="flex flex-col gap-4 h-full pb-20 items-center justify-center">
          <h1 class="font-bold text-2xl">No page selected</h1>
          <h2 class="text-lg font-normal text-gray-800">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            Open a page from
            <span
              class="cursor-pointer hover:bg-blue-500/10 rounded p-0.5 font-bold text-blue-700"
              on:click|stopPropagation={() => {
                leftSidebarOpen = true
                leftSidebarMode = 'list'
              }}>Sidebar</span> to continue
          </h2>
        </div>
      {/if}
    </div>

    <div class="fixed z-20 bottom-0 right-0">
      <AlertProvider alerts={$alert} />
    </div>
    {#if !leftOffcanvasOpen && !rightOffcanvasOpen}
      <ModalProvider />
    {/if}

    <!-- {#if !component_id && activeComponent}
		<div class="z-[10] shadow-lg bg-blue-400 fixed p-1 w-full h-full">
			<iframe title="" src="/edit/component/{activeComponent.id}" class="w-full h-full">

			</iframe>
		
		</div>
			{/if} -->
  </div>
{/if}
