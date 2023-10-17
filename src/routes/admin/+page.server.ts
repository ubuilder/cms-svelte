export async function load({locals}) {
    

    const pages = await locals.api.getPages({perPage: 1000});
    const tables = await locals.api.getTables({perPage: 1000})
    // const files = await locals.api.getAssets({perPage: 1000})


    let total_rows = 0
    for(let table of tables.data!.data) {
        let res = await locals.api.getData({table: table.slug, perPage: 10000});
        total_rows += res.total

    }

    return {
        page_count: pages.data!.total,
        table_count: tables.data!.total,
        total_rows,
        file_count: 4, // files.data!.total


    }

}