import { goto } from '$app/navigation'
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
    } else if (route.indexOf('/{') > -1 && route.startsWith(slug.split('/')[0]) && slug !== '') {
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
  const components = await locals.api.getComponents({ perPage: 500 }).then((res) => res.data.data)
  let { page, params: pageParams } = await findPageBySlug({
    api: locals.api,
    slug: params.slug,
  })

  if (!page) {
    const settings = await locals.api.getSettings().then((res) => res.data)
    if (url.pathname === '/') {
      if (settings.page_home) {
        page = await locals.api.getPage(settings.page_home).then((res) => res.data)
      }
    } else {
      if (settings.page_404) {
        page = await locals.api.getPage(settings.page_404).then((res) => res.data)
      }
    }

    if (!page) {
      return {
        page: {},
        html: '404: page not found!',
      }
    }
  }

  if (url.searchParams.has('edit')) {
    throw redirect(302, '/edit/' + page.id)
  }

  // page = {
  //   id: 'FlAdLSSp',
  //   title: 'todos',
  //   slug: 'todos',
  //   actions: [],
  //   slot: [
  //     {
  //       type: 'IfIlaUIw',
  //       props: {
  //         Class: 'flex flex-col bg-blue-100 __ ',
  //         Slot: {
	// 		slot: [
  //           { type: 'bRWpeMxE', props: { Text: '<p>Todos</p>' } },
  //           {
  //             type: 'IfIlaUIw',
  //             props: {
  //               Class: 'flex flex-col bg-blue-400 __ p-4',
  //               Slot: {
  //                 table: 'RwllZjiC',
  //                 filters: [],
  //                 multiple: true,
  //                 name: 'axckawers',
  //                 page: 0,
  //                 perPage: 5,
  //                 // sort:
  //                 slot: [
  //                   {
  //                     type: 'IfIlaUIw',
  //                     props: {
  //                       Class: ' bg-white text-black __ ',
  //                       Slot: {
	// 						slot: [
	// 							{
	// 							  type: 'bRWpeMxE',
	// 							  props: { Text: '{{axckawers.Text}}' },
	// 							},
	// 						  ]
	// 					},
  //                     },
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //         ]
	// 	},
  //       },
  //     },
  //   ],
  //   head: '<meta name="description" content="{{page.description}}"/>\n<title>{{page.title}}</title>\n<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>',
  //   dir: 'ltr',
  //   description: '',
  // }

  const style = await locals.api.getPageCss({ page_id: page.id }).then((res) => res.data)

  const items: Items = {
    page: {
      slug: params.slug,
      params: pageParams,
    },
  }

  // for (let load of page.load) {
  // 	if (!load.table) throw new Error('Table not found in page load')

  // }
  async function forEachSlot(list, cb) {
    for (let item of list) {
      await cb(item)

      const component = components.find((x) => x.id === item.type)

      for (let field of component.fields) {
        if (field.type === 'slot') {
			await forEachSlot(item.props[field.name]?.slot ?? [], cb)
        }
      }
    }
  }

  await forEachSlot(page?.slot ?? [], async (slot) => {
    // if(!Array.isArray(slot)) {
	const component = components.find(x => x.id === slot.type);

    for (let field of component.fields) {

      if (field.type === 'slot' && slot.props[field.name]?.table) {
        // const id = 'id_' + Math.random()

        // slot.id = id
        const id = slot.props[field.name].name

        const where: DbFilter = {}

        const with_: DbWith = {}

        for (let filter of slot.props[field.name].filters) {
          where[filter.field] = {
            operator: filter.operator,
            value: renderVariable(filter.value, items),
          }
        }

        const table = await locals.api.getTable(slot.props[field.name].table).then((res) => res.data)

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

        if (slot.props[field.name].multiple) {
          items[id] = await locals.api
            .getData({ table: slot.props[field.name].table, where, with: with_ })
            .then((res) => res.data.data!)
        } else {

          items[id] = await locals.api
            .getData({ table: slot.props[field.name].table, where, with: with_ })
            .then((res) => res.data.data[0]!)
        }
      }
    }
  })

  console.log(JSON.stringify(items, null, 2))
  console.log(JSON.stringify(page, null, 2))


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
          if (field.type === 'slot' && slot.props[field.name]) {
            console.log(slot.props)
            if (!slot.props[field.name].table) {

                  props[field.name] = slot.props[field.name]?.slot?.map((slot) => renderSlot(slot, items))
                    .join('')
              
            } else {
              const dynamicListOptions = slot.props[field.name] ?? {}
              const id = dynamicListOptions.name

              console.log(items)
              const listItems = items[id]

              let res = ''

              for (let item of listItems) {
				console.log(dynamicListOptions)
                res += dynamicListOptions.slot.map(x => renderSlot(x, { ...items, [id]: item }))
              }

              props[field.name] = res
            }

            // const list = slot.props[field.name].props.load.split('.').reduce((prev, curr) => {
            //   return prev[curr]
            // }, items)

            // console.log('list: ', list)
            // if (typeof list === 'string') {
            //   props[field.name] = list
            // } else {
            //   props[field.name] = ''
            //   for (let item of list ?? []) {
            //     props[field.name] += slot.props[field.name].props.slot
            //       .map((x) =>
            //         renderSlot(x, { ...items, [slot.props[field.name].props.item]: item })
            //       )
            //       .join('')
            //   }
            // }
          } else {
            props[field.name] = renderVariable(slot.props[field.name], items)
          }
          props['Class'] = slot.props['Class']
        }


        if (component.raw !== false) {
          return hbs.compile(component.template)(props)
        } else {
          return component.slot.map((x) => renderSlot(x, props)).join('')
        }
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

  if (style) {
    page.head += `<style>${style}</style>`
  }

  return {
    page,
    html,
  }
}

export const actions = {
  async default({ request, url, locals, fetch, params }) {
    const data = await request.formData()

    const name = url.searchParams.get('name')

    const obj: any = {}
    data.forEach((value, key) => {
      obj[key] = value
    })

    let { page } = await findPageBySlug({ api: locals.api, slug: params.slug })

    if (!page) {
      const settings = await locals.api.getSettings()
      if (url.pathname === '/') {
        if (settings.page_home) {
          page = await locals.api.getPage(settings.page_home)
        }
      } else {
        if (settings.page_404) {
          page = await locals.api.getPage(settings.page_404)
        }
      }
    }

    if (page) {
      await locals.api.submitForm(page.id, url.pathname, obj)

      // call api
      const action = page.actions.find((x) => x.slug === name)

      if (action) {
        try {
          const body = renderVariable(action.body, { form: obj })

          const res = await fetch(action.url, {
            method: 'POST', // from action
            headers: {
              'content-Type': 'application/json',
              authorization: 'bearer ' + locals.token,
            },
            body,
          }).then(async (res) => {

            throw redirect(300, url.pathname)
          })
        } catch (err) {
          console.log(err)
        }
      }
      // fetch()
    }

    return { success: true }
  },
}
