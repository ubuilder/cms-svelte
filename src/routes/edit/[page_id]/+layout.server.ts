export async function load({params, locals: {api, filters}}) {
    console.log('load')
    // const pagePromise = api.getPage(params.page_id)
    // const pagesPromise = api.getPages({perPage: 50, where: filters}).then(res => res.data.data)
    // const assetsPromise = api.getAssets({perPage: 50}).then(res => res.data)
    // const tablesPromise = api.getTables({ perPage: 50 })
	// 	.then((res) => res.data!.data)
	// const componentsPromise = api.getComponents({ perPage: 500 }).then((res) => res.data)
	// const formsPromise = api.getForms(params.page_id).then((res) => res.data)

    // const [page, pages, assets, tables, components, forms] = await Promise.all([
    //     pagePromise, pagesPromise, assetsPromise, tablesPromise, componentsPromise, formsPromise
    // ])
    
    return {
        // type: page ? 'page': '',
        page_id: params.page_id,
        // pages,
        // tables, 
        // forms,
        // components,
        // assets
    }

}