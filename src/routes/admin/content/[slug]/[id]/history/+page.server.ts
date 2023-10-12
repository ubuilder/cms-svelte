import type { Actions, ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (params) => {
    if(!params.params.slug) return {};

    const table = await params.locals.db('u-tables').get({where:{slug: params.params.slug}})
    
    const rows = await params.locals.db(params.params.slug).history({where: {id: params.params.id}, perPage: 50});

    
    return {
        table,
        rows
    }
    
}

export const actions: Actions = {
    async rollback({request, params, locals}) {
        const body = await request.json();

        await locals.db(params.slug).rollback(params.id, body);
        return {success: true}

    } 
}