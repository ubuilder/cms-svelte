export async function load({params, url}) {
    const redirect_to = '/edit/' + params.page_id
    return {
        component_id: params.component_id,
        redirect_to
    }
}