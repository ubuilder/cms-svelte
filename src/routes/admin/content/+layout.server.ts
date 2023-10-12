import type { Table } from '$lib/types/table.js'

export async function load({locals}) {
    const tables = await locals.db<Table>('u-tables').query({perPage: 50, where: locals.filters}).then(res => res.data)
    
    return {
        tables
    }
}
