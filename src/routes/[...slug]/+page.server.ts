import { renderVariable } from '$lib/helpers/index.js'
import type { ComponentField, DbFilter, DbWith, Items, Table } from '$lib/types/index.js'
import type { Page } from '$lib/types/page.js'
import type { Component } from '$lib/ui'
import { redirect } from '@sveltejs/kit'
import hbs from 'handlebars'

async function findPageBySlug({
	api,
	slug,
}: {
	api: App.Locals['api']
	slug: string
}): Promise<{ page?: Page; params: Record<string, string> }> {
	let routes = []
	const pages = await api.getPages({ where: {} }).then((res) => res.data.data)
	for (let page of pages) {
		routes.push(page.slug)
	}
	routes.sort((route) => {
		return route.includes('{') ? -1 : 1
	})
	routes.sort((route) => {
		return route.includes('{...') ? -1 : 1
	})
	routes.reverse()

	for (let route of routes) {
		const page = pages.find((x) => x.slug === route)

		if (route == slug) {
			return { page, params: {} }
		} else if (route.indexOf('/{') > -1 && route.startsWith(slug.split('/')[0])) {
			let key = route.split('/')[1]
			key = key.substring(1, key.length - 1)
			return {
				page,
				params: {
					[key]: slug.split('/')[1],
				},
			}
		}
	}
	console.log('not such route found: ', slug)
	return { page: undefined, params: {} }
}

export async function load({ locals, params, url }) {
	const components = await locals.api.getComponents({ perPage: 500 }).then((res) => res.data)
	let { page, params: pageParams } = await findPageBySlug({
		api: locals.api,
		slug: params.slug,
	})

	if (!page) {
		const settings = await locals.api.getSettings() 
		if(url.pathname === '/') {
			if(settings.page_home) {
				page = await locals.api.getPage(settings.page_home)
			}
		} else {
			if(settings.page_404) {
				page = await locals.api.getPage(settings.page_404)
			}
		}

		if(!page)  {
			return {
				page: {},
				html: '404: page not found!'
			}
		}
	}

	if (url.searchParams.has('edit')) {
		
		throw redirect(302, '/admin/pages/' + page.id)
	}

	const style = await locals.api.getPageCss({ page_id: page.id }).then((res) => res.data)

	const items: Items = {
		page: {
			slug: params.slug,
			params: pageParams,
		},
	}

	for (let load of page.load) {
		if (!load.table) throw new Error('Table not found in page load')

		const where: DbFilter = {}

		const with_: DbWith = {}

		for (let filter of load.filters) {
			where[filter.field] = {
				operator: filter.operator,
				value: renderVariable(filter.value, items),
			}
		}

		const table = await locals.api.getTable(load.table)

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


		if (load.multiple) {
			items[load.name] = await locals.api
				.getData({ table: load.table, where, with: with_ })
				.then((res) => res.data!)
		} else {
			items[load.name] = await locals.api
				.getData({ table: load.table, where, with: with_ })
				.then((res) => res.data[0]!)
		}

	}

	function render(page: Page) {
		function renderSlot(slot: any, items = {}) {
			const props: any = {}
			const component: Component | undefined = components.find((x) => x.id === slot.type)
			if (component) {
				let fields: ComponentField[] = []
				if (Array.isArray(component.fields)) {
					fields = component.fields
				} else {
					Object.keys(component.fields).map((key) => {
						fields = [...fields, ...component.fields[key]]
					})
				}

				for (let field of fields) {
					if (field.type === 'slot') {
						if (slot.props[field.name].type === '__list__') {
							const list = slot.props[field.name].props.load.split('.').reduce((prev, curr) => {
								return prev[curr]
							}, items)

							props[field.name] = ''
							for (let item of list) {
								props[field.name] += slot.props[field.name].props.slot
									.map((x) =>
										renderSlot(x, { ...items, [slot.props[field.name].props.item]: item })
									)
									.join('')
							}
						} else {
							props[field.name] = slot.props[field.name]
								.map((slot) => renderSlot(slot, items))
								.join('')
						}
					} else {
						props[field.name] = renderVariable(slot.props[field.name], items)
					}
				}
				return hbs.compile(component.template)(props)
			}
		}

		const html = page.slot.map((slot) => renderSlot(slot, items)).join('')
		return { html }
	}

	page.title = renderVariable(page.title, items)
	items.page.title = page.title

	if (page.description) {
		page.description = renderVariable(page.description, items)
		items.page.description = page.description
	}
	if (page.dir) {
		page.dir = renderVariable(page.dir, items)
	}
	if (page.head) {
		page.head = renderVariable(page.head, items)
	}

	const { html } = render(page)

	page.head += `<style>${style}</style>`

	return {
		page,
		html,
	}
}

export const actions = {
	async default({request, locals, params}) {
		const data = await request.formData();

		const obj: any = {}
		data.forEach((value, key) => {
			obj[key] = value
		})

		let {page} = await findPageBySlug({api: locals.api, slug: params.slug});

		if (!page) {
			const settings = await locals.api.getSettings() 
			if(url.pathname === '/') {
				if(settings.page_home) {
					page = await locals.api.getPage(settings.page_home)
				}
			} else {
				if(settings.page_404) {
					page = await locals.api.getPage(settings.page_404)
				}
			}
		}
	
		if(page) {
			await locals.api.submitForm(page.id, new URL(request.url).pathname, obj)
		}

		return {success: true}
	}
}