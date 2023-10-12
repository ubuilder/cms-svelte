import type { DbTable, Table } from "$lib/types"
import type { ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = async ({ params, locals }) => {
    const table = await locals.db<Table>('u-tables').get({ where: { slug: params.slug! } })

    const rows = await locals.db<DbTable>(params.slug!).query({ where: locals.filters })
    for (let value of rows.data) {

        for (let field of table.fields) {
            if (field.type === 'relation') {
                if (field.multiple) {
                    value[field.name] = await locals.db(field.table).query({
                        where: {
                            [field.field + '_id']: {
                                operator: '=',
                                value: value.id
                            }
                        }
                    }).then(res => res.data)
                } else {
                    const id = value[field.name + '_id']

                    if (id) {
                        const filters = { id: id }
                        value[field.name] = await locals.db(field.table).get({ where: filters })
                    }
                }
            }
        }
    }

    return {
        table,
        rows
    }
}
