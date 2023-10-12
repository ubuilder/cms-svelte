export async function load({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})

    console.log('load value: ', table.slug, params.id)

    const value = await locals.db(table.slug).get({where: {id: params.id}})   

    console.log('layout load', value)

    for(let field of table.fields) {
        if(field.type === 'relation') {
            console.log('field is relation', field.name)
            if(field.multiple) {
                // blog.posts
                    console.log('field is multiple relation', field, value)
                    console.log('get all ', field.table, 'where', field.field + '_id', 'is equal to ', value.id);

                value[field.name] = await locals.db(field.table).query({where: {
                    [field.field + '_id']: {
                        operator: '=',
                        value: value.id
                    }
                }}).then(res => res.data)
                console.log('load relations: ', value)
                // const ids = value[field.name]

                // const filters = { id: {
                //     operator: 'in',
                //     value: ids ?? []
                // }}
                //  console.log(filters)
                // value[field.name] = await locals.db(field.table).query({where: filters}).then(res => res.data)   
            } else {
                const id = value[field.name + '_id']

                const filters = { id: id}
                value[field.name] = await locals.db(field.table).get({where: filters})   
            }

        }
    }

    console.log(value)
    
    return {
        table,
        value
    }
}