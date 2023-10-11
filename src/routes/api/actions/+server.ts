import type { Table } from '$lib/types'

export async function GET({ locals }) {
    const tables = await locals.db<Table>('u-tables').query({ perPage: 50 }).then(res => res.data)


    const data = tables.map(table => ([
        {
            name: 'Create ' + table.name,
            key: 'create',
            fields: [{name: 'table', type: 'hidden', value: table.slug}, ...table.fields]
        },
        {
            name: 'Update ' + table.name,
            key: 'update',
            fields: [{name: 'table', type: 'hidden', value: table.slug}, { name: 'id', type: 'plain_text' }, ...table.fields]
        },
        {
            name: 'Remove ' + table.name,
            key: 'remove',
            fields: [{name: 'table', type: 'hidden', value: table.slug}, { name: 'id', type: 'plain_text' }]
        },

    ]))


    return new Response(JSON.stringify(data))

}