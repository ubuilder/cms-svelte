import { renderVariable } from "$lib/helpers/index.js";

async function findPageBySlug({locals, slug}: any = {}) {
  let routes =  []
  const pages = await locals.db('u-pages').query({where: {}})
  for (let page of pages.data){
    routes.push(page.slug) 
  }
  routes.sort()
  routes.sort((route)=>{
    return route.includes('{')? -1: 1
  })
  routes.sort((route)=>{
    return route.includes('{...')? -1: 1
  })
  routes.reverse()
  console.log("routes", routes)

  console.log("slug", slug)
  for(let route of routes){
    if(route == slug){
      const page = await locals.db("u-pages").get({ where: {slug: route} });
      return {page, params: {}}; 
    }else if(route.indexOf('/{') > -1 && route.startsWith(slug.split("/")[0])){
      console.log('this')
      const page = await locals.db("u-pages").get({ where: {slug: route} });
      console.log(route)
      let key = route.split("/")[1]
      key = key.substring(1, key.length -1)
      return {
        page,
        params:{
          [key]: slug.split("/")[1]
        }
      }; 
    }
  }  
  console.log("not such route found: ", slug)

}

export async function load({ locals, params }) {
  const {page, params: pageParams} = await findPageBySlug({locals, slug: params.slug});
  console.log('page ==' , page)

  const items: any = {
    page: {
      slug: params.slug,
      params: pageParams
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

    for(let field of table.fields) {
      if(field.type === 'relation') {
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
