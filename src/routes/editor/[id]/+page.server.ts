export async function load({params, locals: {api}}) {
    const page = await api.getPage(params.id)

    const css = await api.getPageCss(page)
    
    return {
        page,
        head: `<style>${css.data}</style>`, 
        components: await api.getComponents({perPage: 200}).then(res => res.data)
    }

}