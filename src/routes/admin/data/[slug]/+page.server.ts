import type { Actions, ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = async({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})

    const rows = await locals.db(params.slug).query({where: locals.filters})
    for(let value of rows.data) {

        for(let field of table.fields) {
            if(field.type === 'relation') {
                if(field.multiple) {
                    const ids = value[field.name]

                    const filters = { id: {
                        operator: 'in',
                        value: ids ?? []
                    }}
                    console.log(filters)
                    value[field.name] = await locals.db(field.table).query({where: filters}).then(res => res.data)   
                } else {
                const id = value[field.name]

                    const filters = { id: id}
                    value[field.name] = await locals.db(field.table).get({where: filters})   
                }

            }
        }
    }
    return {
        table,
        rows
    }
}

export const actions: Actions = {
    async insert({request, locals, params}) {
        const body = await request.json()

        await locals.db(params.slug).insert(body)

        return {success: true}
    },
    async update({request, locals, params}) {
        const body = await request.json()

        const {id, ...fields} = body

        console.log({fields})
        await locals.db(params.slug).update(id, fields)

        return {success: true}
    },
    async remove({request, locals, params}) {
        const body = await request.json()

        await locals.db(params.slug).remove(body.id)

        return {success: true}
    },
}