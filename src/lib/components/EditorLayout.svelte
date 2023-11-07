<script lang="ts">
	import EditorOffcanvases from './EditorOffcanvases.svelte'

	import hbs from 'handlebars'
	import '@ulibs/yesvelte/styles.css'
	import './Editor.css'
	import { onMount, tick } from 'svelte'
	import {
		AlertProvider,
		Button,
		Icon,
		Loading,
		ModalProvider,
		alert,
		Dropdown,
		Avatar,
		DropdownMenu,
		DropdownItem,
	} from '@ulibs/yesvelte'

	import SidebarTableList from './SidebarTableList.svelte'
	import SidebarPageList from './SidebarPageList.svelte'
	import { api } from '$lib/helpers/api'
	import SidebarSlotList from './SidebarSlotList.svelte'
	import SidebarComponentList from './SidebarComponentList.svelte'
	import SidebarComponentOption from './SidebarComponentOption.svelte'
	import HeaderItem from './HeaderItem.svelte'
	import { t } from '$lib/i18n'
	import SlotEditor from './SlotEditor.svelte'

	let editor: any

	let components: any[] = []

	let user = {}
	let pages: any[] = []
	let settings = {}

	export let page_id: any = undefined

	let page: any = null

	let activeSlot: any = null

	let mode = 'options'

	let offcanvasMode: string | undefined = undefined
	let offcanvasData = {}

	const hbsTemplates: any = {}

	let leftOffcanvasOpen = false
	let rightOffcanvasOpen = false

	function getComponent(id: string) {
		return components.find((x) => x.id === id)
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

	async function onSave() {
		console.log('onSave', page)
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

	$: {
		leftSidebarOpen
		rightSidebarOpen

		setTimeout(() => {
			editor?.updateActiveBorder()
		}, 400)
	}

	let loading = true

	async function reload(event: CustomEvent<string[]> | string[] | null = null) {
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
		} else {
			components = await api('/components').then((res) => res.data)
			pages = await api('/pages').then((res) => res.data)
			settings = await api('/settings').then((res) => res.data)

			for (let component of components) {
				hbsTemplates[component.id] = hbs.compile(component.template)
			}
		}
	}

	onMount(async () => {
		await reload()
		loading = false
	})

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

	$: if (mode === 'add') {
		// enable drag and drop for components in sidebar
		editor?.render()
	}

	let leftSidebarOpen = false
	let rightSidebarOpen = false
</script>

<svelte:head>
	<title>Page Editor | {page?.title ?? '---'}</title>
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<!-- <script src="https://cdn.tailwindcss.com"></script> -->
	<script src="/cdn.tailwindcss.com.js"></script>
</svelte:head>

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

				<HeaderItem icon="photo" on:click={() => offcanvas.openLeft('assets')} />
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
			</div>

			<div class="flex items-center gap-2">
				{#if page}
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
			on:reload={reload}
			bind:data={offcanvasData}
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
						<SidebarComponentList
							on:reload={reload}
							on:open-component-settings={(e) => openComponentSettings(e.detail)}
							bind:activeSlot
							bind:mode
							{components} />
					{:else if activeSlot}
						<SidebarComponentOption
							{components}
							on:select-slot={(e) => editor.selectSlot(e.detail.id)}
							on:reload={reload}
							bind:activeSlot />
					{/if}
				</div>
			</div>
		</div>

		<div
			class="wrapper"
			class:right-sidebar-open={rightSidebarOpen}
			class:left-sidebar-open={leftSidebarOpen}>
			{#if page}
				<SlotEditor
					bind:this={editor}
					on:open-component-list={() => {
						mode = 'add'
						rightSidebarOpen = true
					}}
					on:open-component-options={(e) => {
						console.log('open component options', e.detail)
						mode = 'options'
						rightSidebarOpen = true
						activeSlot = e.detail
					}}
					bind:slotList={page.slot} />
			{:else}
				<div class="flex flex-col gap-4 h-full pb-20 items-center justify-center">
					<h1 class="font-bold text-2xl">No page selected</h1>
					<h2 class="text-lg font-normal text-gray-800">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						Open a page from
						<span
							class="cursor-pointer hover:bg-blue-50 rounded p-0.5 font-bold text-blue-700"
							on:click|stopPropagation={() => {
								leftSidebarOpen = true
								mode = 'list'
							}}>Sidebar</span> to continue
					</h2>
				</div>
			{/if}
		</div>

		<div class="fixed top-8 right-0">
			<AlertProvider alerts={$alert} />
		</div>
		{#if !leftOffcanvasOpen && !rightOffcanvasOpen}
			<ModalProvider />
		{/if}
	</div>
{/if}
