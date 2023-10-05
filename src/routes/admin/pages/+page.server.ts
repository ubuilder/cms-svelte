export async function load({locals, params}) {
    return {
        pages: await locals.db('u-pages').query({where: locals.filters}).then(res => res.data)
    }
}


export const actions = {
    async addPage({locals, request}) {
        const body = await request.json();


        await locals.db('u-pages').insert({
            title: body.title,
            slug: body.slug?.startsWith('/') ? body.slug?.substring(1) : body.slug,
            props: {},
            load: [],
            slot: []
        })
        return {success: true}

    }
}