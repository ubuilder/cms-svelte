import { renderVariable } from "$lib/helpers/index.js";
import type { Db, DbFilter, DbWith, Items, Table } from "$lib/types/index.js";
import type { Page } from "$lib/types/page.js";

async function findPageBySlug({ db, slug }: {db: Db, slug: string}): Promise<{ page?: Page, params: Record<string, string> }> {
  let routes = []
  const pages = await db<Page>('u-pages').query({ where: {} })
  for (let page of pages.data) {
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
  console.log("routes", routes)

  console.log("slug", slug)
  for (let route of routes) {
    if (route == slug) {
      const page = await db<Page>("u-pages").get({ where: { slug: route } });
      return { page, params: {} };
    } else if (route.indexOf('/{') > -1 && route.startsWith(slug.split("/")[0])) {
      console.log('this')
      const page = await db<Page>("u-pages").get({ where: { slug: route } });
      console.log(route)
      let key = route.split("/")[1]
      key = key.substring(1, key.length - 1)
      return {
        page,
        params: {
          [key]: slug.split("/")[1]
        }
      };
    }
  }
  console.log("not such route found: ", slug)
  return {page: undefined, params: {}}

}

export async function load({ locals, params }) {
  const { page, params: pageParams } = await findPageBySlug({ db: locals.db, slug: params.slug });
  console.log('page ==', page)

  if(!page) throw new Error('Page not found!');

  const items: Items = {
    page: {
      slug: params.slug,
      params: pageParams
    },
  };
  for (let load of page.load) {
    if (!load.table) throw new Error("Table not found in page load");

    const where: DbFilter = {};

    const with_: DbWith = {};

    for (let filter of load.filters) {
      where[filter.field] = {
        operator: filter.operator,
        value: renderVariable(filter.value, items),
      };
    }

    const table: Table = await locals.db<Table>('u-tables').get({ where: { slug: load.table } });

    for (let field of table.fields) {
      if (field.type === 'relation') {
        with_[field.name] = {
          table: field.table,
          // field: field.field + '_id', // not working
          field: 'author' + '_id', // working

          multiple: field.multiple
        }
      }
    }

    console.log('with_', with_)

    if (load.multiple) {
      items[load.name] = await locals
        .db(load.table)
        .query({ where, with: with_ })
        .then((res: any) => res.data);
    } else {
      items[load.name] = await locals
        .db(load.table)
        .get({ where, with: with_ });
    }

    console.log('after load: ', items)
  }

  async function render(page: Page) {
    page.title = renderVariable(page.title, items);
    if(page.description) {
      page.description = renderVariable(page.description, items);
    }

    return page;
  }

  return {
    page: await render(page),
    items,
  };
}
