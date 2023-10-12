import type { Page } from '$lib/types/index.js';
import type { Actions } from '@sveltejs/kit';

export async function load({locals, params}) {
    return {
        pages: await locals.api.getPages({where: locals.filters}).then((res:any)=> res.data)
        // pages: await locals.db('u-pages').query({where: locals.filters}).then(res => res.data)
    }
}


export const actions: Actions = {
    async addPage({locals, request}) {
        const body = await request.json();

        await locals.api.createPage({
            title: body.title,
            slug: body.slug?.startsWith('/') ? body.slug?.substring(1) : body.slug,
            dir: 'ltr',
            description: '',
            load: [],
            slot: []
        })
        return {success: true}

    }
}