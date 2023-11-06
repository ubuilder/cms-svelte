import { respond } from '$lib/helpers/api.js';


export async function GET({request, locals, url}) {
    const response: any = {}

    const settings = await locals.api.getSettings()
    console.log(settings)

    return respond(settings.status, settings.message, settings.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.json();

    // upload file
    const res = await locals.api.setSettings(body);
    
    return respond(res.status, res.message, res.data)
}