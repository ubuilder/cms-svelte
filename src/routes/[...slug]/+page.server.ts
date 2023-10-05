import { renderVariable } from "$lib/helpers/index.js";

async function findPageBySlug({locals, slug}: any = {}) {
  let routes =  []
  const pages = await locals.db('u-pages').query({where: {}})
  for (let page of pages.data){
    routes.push(page.slug) 
  }
  routes.sort()
  routes.sort((route)=>{
    return route.includes('[')? -1: 1
  })
  routes.sort((route)=>{
    return route.includes('[...')? -1: 1
  })
  routes.reverse()

  for(let route of routes){1
    if(route == slug){
      const page = await locals.db("u-pages").get({ where: {slug: route} });
      return page; 
    }
  }
  console.log("not such route found: ", slug)

}

export async function load({ locals, params }) {
  const page = await findPageBySlug({locals, slug: params.slug});
  console.log('page ==' , page)

  const items: any = {
    page: {
      slug: params.slug,
      params: {}
    },
  };
  for (let load of page.load) {
    if(!load.table) continue;
    
    const where: any = {};

    const with_: any = {};

    for (let filter of load.filters) {
      where[filter.field] = {
        operator: filter.operator,
        value: renderVariable(filter.value, items),
      };
    }

    const table = await locals.db('u-tables').get({where: {slug: load.table}});

    console.log(table)
    for(let field of table.fields) {
      if(field.type === 'relation') {
        with_[field.name] = {
          table: field.table,
          field: field.field + '_id',
          multiple: field.multiple
        }
      }
    }

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

  async function render(page: any) {
    page.title = renderVariable(page.title, items);
    page.description = renderVariable(page.description, items);

    return page;
  }

  return {
    page: await render(page),
    items,
  };
}
