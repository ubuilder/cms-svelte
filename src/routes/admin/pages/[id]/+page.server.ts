import type { Page } from '$lib/types/page.js';
import type { Table } from '$lib/types/table.js';

export async function load({ locals, params }) {
  const tables = await locals
    .db<Table>("u-tables")
    .query({ perPage: 100 })
    .then((x) => x.data);

  return {
    tables,
    page: await locals.db<Page>("u-pages").get({ where: { id: params.id } }),
  };
}

export const actions = {
  async updatePage({ request, locals }) {
    const body = await request.json();
    await locals.db<Page>("u-pages").update(body.id, body);

    return { success: true };
  },
  async removePage({ request, locals, params }) {
    console.log("remove page", params.id);
    const id = params.id;
    await locals.db("u-pages").remove(id)
    return { success: true };
  },
};
