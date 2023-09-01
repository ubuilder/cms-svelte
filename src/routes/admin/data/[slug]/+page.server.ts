export async function load({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})

    const rows = await locals.db(params.slug).query({where: locals.filters})

    return {
        table,
        rows
    }
}

export const actions = {
    async insert({request, locals, params}) {
        const body = await request.json()

        await locals.db(params.slug).insert(body)

        return {success: true}
    },
    async update({request, locals, params}) {
        const body = await request.json()

        const {id, ...fields} = body

        await locals.db(params.slug).update(id, fields)

        return {success: true}
    },
    async remove({request, locals, params}) {
        const body = await request.json()

        await locals.db(params.slug).remove(body.id)

        return {success: true}
    },
}