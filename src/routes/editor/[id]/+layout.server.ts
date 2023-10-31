export async function load({params, locals: {api, filters}}) {
    const page = await api.getPage(params.id)
    const pages = await api.getPages({where: filters})



    const css = await api.getPageCss(page)
    
    return {
        page,
        pages,
        head: '', //`<style>${css.data}</style>`, 
        components: await api.getComponents({perPage: 200}).then(res => res.data)
    }

}