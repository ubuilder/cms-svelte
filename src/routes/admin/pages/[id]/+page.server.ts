export async function load({locals, params}) {
    const tables = await locals.db("u-tables").query({perPage: 100}).then(x=>x.data)
    return {
        tables,
        page: await locals.db('u-pages').get({where: {id: params.id}})
    } 
}

export const actions = {
    async addPage({request, locals}) {
        const body = await request.json();

        locals.db('pages').insert({
            slug: body.slug,
            props: {
                title: body.title,
            },
            slot: body.slot
        })
    },
    async updatePage({request, locals}) {
        const body = await request.json()
        await locals.db('u-pages').update(body.id, body)

        return  {success: true}
    }
}