import type { Page } from '$lib/types/page.js';
import type { Table } from '$lib/types/table.js';

export async function load({ locals, params }) {
  const tables = await locals.api.getTables({perPage: 50, where: locals.filters}).then(res => res.data!.data)

  return {
    tables,
    page: await locals.api.getPage( params.id),
  };
}

export const actions = {
  async updatePage({ request, locals }) {
    const {id, ...data} = await request.json();

    await locals.api.updatePage({id, data});

    return { success: true };
  },
  async removePage({ request, locals, params }) {
    console.log("remove page", params.id);
    const id = params.id;
    await locals.api.removePage(id)
    
    return { success: true };
  },
};
