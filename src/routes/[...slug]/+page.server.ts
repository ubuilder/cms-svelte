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
	routes.sort()
	routes.sort((route) => {
		return route.includes('{') ? -1 : 1
	})
	routes.sort((route) => {
		return route.includes('{...') ? -1 : 1
	})
	routes.reverse()
	console.log('routes', routes)

	console.log('slug', slug)
	for (let route of routes) {
		if (route == slug) {
			const page = await api.getPages({ where: { slug: route } }).then((res) => res.data!.data[0])
			return { page, params: {} }
		} else if (route.indexOf('/{') > -1 && route.startsWith(slug.split('/')[0])) {
			console.log('this')
			const page = await api.getPages({ where: { slug: route } }).then((res) => res.data!.data[0])
			console.log(route)
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
	const { page, params: pageParams } = await findPageBySlug({
		api: locals.api,
		slug: params.slug,
	})
	console.log('page ==', page)

	if (!page) throw new Error('Page not found!')

	if(url.searchParams.has('edit')) {
		throw redirect(302, '/admin/pages/' + page.id)	
	}

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

		const table = await locals.api.getTableBySlug(load.table)

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

		console.log('with_', with_)

		if (load.multiple) {
			items[load.name] = await locals.api
				.getData({ table: load.table, where, with: with_ })
				.then((res) => res.data!)
		} else {
			items[load.name] = await locals.api
				.getData({ table: load.table, where, with: with_ })
				.then((res) => res.data[0]!)
		}

		console.log('after load: ', items)
	}

	function render(page: Page) {
		let style = page.css

		function renderSlot(slot: any) {
			console.log('renderSlot')
			const props: any = {}
			const component: Component | undefined = components.find((x) => x.name === slot.type)
			if (component) {
				style += component.css;
				let fields: ComponentField[] = []
				if (Array.isArray(component.fields)) {
					fields = component.fields
				} else {
					Object.keys(component.fields).map((key) => {
						fields = [...fields, ...component.fields[key]]
					})
				}

				console.log(component.fields)
				for (let field of fields) {
					if (field.type === 'slot') {
						props[field.name] = slot.props[field.name].map((slot) => renderSlot(slot)).join('')
					} else {
						console.log(props, slot, field)
						props[field.name] = renderVariable(slot.props[field.name], items)
					}
				}
				console.log(props)
				return hbs.compile(component.template)(props)
			}
		}

		const html = page.slot
			.map((slot) => renderSlot(slot))
			.join('')
		return {style, html}
	}

	console.log(page)
	
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

	// console.log({items})
	const {style, html} = render(page)

	page.head += `<style>${style}</style>`
	
	return {
		page,
		html,
		style,
		items,
	}
}
