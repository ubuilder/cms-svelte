export async function load({locals}) {
    const page = locals.db('pages').get({where: {id: '12'}});


    return {page} 
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
        await locals.db('pages').update(body.id, body)

        return  {success: true}
    }
}