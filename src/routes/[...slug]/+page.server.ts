import { renderVariable } from "$lib/helpers/index.js";

async function findPageBySlug({locals, slug}: any = {}) {
  const page = await locals.db("u-pages").get({ where: { slug} });


  return page;
}

export async function load({ locals, params }) {
  const page = await findPageBySlug({locals, slug: params.slug});

  const items: any = {
    page: {
      slug: params.slug,
      params: {}
    },
  };
  for (let load of page.load) {
    const where: any = {};

    const with_: any = {};

    for (let filter of load.filters) {
      where[filter.field] = {
        operator: filter.operator,
        value: renderVariable(filter.value, items),
      };
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
