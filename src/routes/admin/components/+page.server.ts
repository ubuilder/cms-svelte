import { redirect } from '@sveltejs/kit';

export async function load({locals}) {

    const components = await locals.api.getComponents({where: locals.filters, perPage: 50}).then(res => res.data);

    return {
        components
    }
}

export const actions = {
    async createComponent(event) {
        const body = await event.request.json();

        console.log(body)
        const result = await event.locals.api.createComponent(body);

        throw redirect(301, '/admin/components/' + result.id)

    }
}