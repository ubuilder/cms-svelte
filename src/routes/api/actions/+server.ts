import type { Table } from '$lib/types'

export async function GET({ locals }) {
    const tables = await locals.db<Table>('u-tables').query({ perPage: 50 }).then(res => res.data)


    const data = [
        {
            name: 'Create',
            key: 'create',
            label: 'table',
            fields: tables.map(x => ({ text: x.name, key: x.slug, fields: x.fields }))
        },
        {
            name: 'Update',
            key: 'update',
            label: 'table',
            fields: tables.map(x => ({ text: x.name, key: x.slug, fields: [{ name: 'id', type: 'plain_text' }, ...x.fields] }))
        },
        {
            name: 'Remove',
            key: 'remove',
            label: 'table',
            fields: tables.map(x => ({ text: x.name, key: x.slug, fields: [{ name: 'id', type: 'plain_text' }] }))
        },

    ]


    return new Response(JSON.stringify(data))

}