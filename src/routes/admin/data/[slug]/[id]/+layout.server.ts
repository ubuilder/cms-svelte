export async function load({params, locals}) {
    const table = await locals.db('u-tables').get({where: {slug: params.slug }})


    const value = await locals.db(table.slug).get({where: {id: params.id}})   


    for(let field of table.fields) {
        if(field.type === 'relation') {
            if(field.multiple) {
                const ids = value[field.name]

                const filters = { id: {
                    operator: 'in',
                    value: ids
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

    console.log(value)
    
    return {
        table,
        value
    }
}