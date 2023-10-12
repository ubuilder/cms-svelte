import type { Table } from '$lib/types/table.js'

export async function load({params, locals}) {
    const table = await locals.db<Table>('u-tables').get({where: {slug: params.slug }})

    return {
        table,
    }
}