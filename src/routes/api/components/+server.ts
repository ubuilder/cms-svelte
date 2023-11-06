import { respond } from '$lib/helpers/api.js';

export async function GET({request, locals, url}) {

    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.getComponent(id);

        return respond(res.status, res.message, res.data)
    }

    const response: any = {}

    const pages = await locals.api.getComponents({perPage: 100})
    console.log(pages)

    return respond(pages.status, pages.message, pages.data.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.json();


    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.updateComponent(id, body);

        return respond(res.status, res.message, res.data)
    }


    const res = await locals.api.createComponent(body)

    const response: any = {}

    response.message = res.message
    response.status = res.status    
    response.data = res.data
    
    return respond(res.status, res.message, res.data)
}