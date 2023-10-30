export async function load({params, locals: {api, filters}}) {
    const page = await api.getPage(params.page_id)
    const pages = await api.getPages({where: filters})

    let component;

    let type = '';

    if(page) {
        type = 'page'
    }

    if(!page) {
        component = await api.getComponent(params.page_id);
        if(component && component.raw) {
            type = 'component'
        }
    }
    
    return {
        type,
        page,
        component,
        pages,
        components: await api.getComponents({perPage: 200}).then(res => res.data)
    }

}