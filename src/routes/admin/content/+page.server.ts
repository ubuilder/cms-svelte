import { slugify } from "$lib/helpers/index.js";
import type { Table } from "$lib/types/table.js";
import type { Actions } from "./$types";
import { readFile, writeFile } from "fs/promises";

export const actions : Actions = {
    async create(event) {
        const body = await event.request.json()

        await event.locals.db('u-tables').insert({
            name: body.name,
            slug: slugify(body.name),
            icon: body.icon,
            fields: body.fields
        })

        return {success: true}
    },
    async update(event) {
        const body = await event.request.json()

        await event.locals.db('u-tables').update(body.id, {
            name: body.name,
            icon: body.icon,
            fields: body.fields
        })

        return {success: true}
    },
    async remove(event) {
        const body = await event.request.json();

        const table = await event.locals.db<Table>('u-tables').get({where: {id: body.id}})

        // remove {table.slug} table
        const fileName = `./data/${event.locals.siteId}/db.json`

        const data = JSON.parse(await readFile(fileName, 'utf-8'));

        console.log('table slug: ', table.slug, table)
        delete data[table.slug]

        await writeFile(fileName, JSON.stringify(data));


        await event.locals.db('u-tables').remove(body.id);

        return {success: true}
    }

}