import type { Page } from '$lib/types/index.js';
import { redirect, type Actions } from '@sveltejs/kit';

export async function load({locals, params}) {
    return {
        pages: await locals.api.getPages({where: locals.filters}).then((res:any)=> res.data.data)
    }
}


export const actions: Actions = {
    async addPage({locals, request}) {
        const body = await request.json();

        const page = await locals.api.createPage({
            title: body.title,
            slug: body.slug?.startsWith('/') ? body.slug?.substring(1) : body.slug,
        })

        throw redirect(301, '/admin/pages/' + page.data!.id)

        return {success: true}
    }
}