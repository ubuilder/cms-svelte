import { error, type Actions, type ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = async ({ params, locals }) => {
    const table = await locals.db('u-tables').get({ where: { slug: params.slug } })

    const rows = await locals.db(params.slug).query({ where: locals.filters })
    for (let value of rows.data) {

        for (let field of table.fields) {
            if (field.type === 'relation') {
                if (field.multiple) {
                    console.log('loiad multuple relations: ', field.table, field.field, value.id)
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

                    const filters = { id: id }
                    value[field.name] = await locals.db(field.table).get({ where: filters })
                }

            }
        }
    }
    return {
        table,
        rows
    }
}

async function preparePayload({locals, params, body, id = undefined, afterInsert, mode = 'insert'} = {}) {
    const table = await locals.db('u-tables').get({ where: { slug: params.slug } })

    const payload: any = {}

    for (let field of table.fields) {
        // check required only on insert
        if(mode === 'insert' && field.required) {
            if (!body[field.name]) {
                throw error(400, `the "${field.name}" field is required`);
            }
        }

        // number validation
        if (body[field.name] && field.type === 'number') {

            if (isNaN(Number(body[field.name]))) {
                throw error(400, `the "${field.name}" field should be a number`);
            } else {
                body[field.name] = +body[field.name];
            }


            if (typeof field.min !== undefined && field.min > body[field.name]) {
                throw error(400, `the "${field.name}" field should be larger than ${field.min}`);
            }
            if (typeof field.max !== undefined && field.max < body[field.name]) {
                throw error(400, `the "${field.name}" field should be smaller than ${field.min}`);
            }
            if (field.negative  && 0 < body[field.name]) {
                throw error(400, `the "${field.name}" field should not be negative`);
            }
        }

        if(body[field.name] && field.type === 'relation') {
            if(field.multiple) { // user.posts
                // update other table
                const otherTable = await locals.db('u-tables').get({where: {slug: field.table}});
                const otherField = otherTable.fields.find(x => x.name === field.field) ;
                
                if(otherField) {   
                    // update other table
                    if(mode === 'insert') {

                    afterInsert(async (id: string) => {
                        console.log('after insert: id: ', id, 'body field name: ', body[field.name])
                        for(let otherId of body[field.name]) {
                            await locals.db(otherTable.slug).update(otherId, {
                                [field.field + '_id']: id // id of new inserted item
                            })
                        }
                    })
                } else {
                    console.log(`[${mode} - ${id}] set `, field.field + '_id', 'of ', otherTable.slug,' to ' + id, 'where there ids are', body[field.name])
                    for(let otherId of body[field.name]) {
                        await locals.db(otherTable.slug).update(otherId, {
                            [field.field + '_id']: id // id of new inserted item
                        })
                    }
                }


                } else {
                    throw error(400, 'this relation field is not connected to other table 1..')

                    // not connected
                }


            } else { // blog.author
                const otherTable = await locals.db('u-tables').get({where: {slug: field.table}});
                const otherField = otherTable.fields.find(x => x.type === 'relation' && x.table === params.slug && x.multiple && x.field === field.name);
            
                if(otherField) {
                    payload[field.name + '_id'] = body[field.name]
                } else {
                    // not connected
                    throw error(400, 'this relation field is not connected to other table..')
                }
            }

        } else {
            payload[field.name] = body[field.name]
        }
    }
    return payload;
}

export const actions: Actions = {
    async insert({ request, locals, params }) {
        let afterInsertFn: any = null
        function afterInsert(callback: any) {
            afterInsertFn = callback
        }

        const body = await request.json()

        const payload: any = await preparePayload({body, params, locals, afterInsert})
        

        const ids = await locals.db(params.slug).insert(payload)

        if(afterInsertFn) {
            await afterInsertFn(ids[0])
        }

        return { success: true }
    },
    async update({ request, locals, params }) {
        const body = await request.json()

        const { id, ...fields } = body

        console.log('in update: ', id)
        const payload = await preparePayload({locals, id, params, body: fields, mode: 'update', afterInsert: () =>{}});
        await locals.db(params.slug).update(id, payload)

        return { success: true }
    },
    async remove({ request, locals, params }) {
        const body = await request.json()

        await locals.db(params.slug).remove(body.id)

        return { success: true }
    },
}