export async function load({locals, params}) {

    const component = await locals.api.getComponent(params.id); 
    
    return {
        component
    }

}

export const actions = {
    async remove(event) {
        await event.locals.api.removeComponent(event.params.id)

        return {
            success: true
        }
    },
    async update(event) {
        const body = await event.request.json();
        
        await event.locals.api.updateComponent(event.params.id, body);

        return {
            success: true
        }
    },
}