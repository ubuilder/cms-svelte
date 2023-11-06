import { respond } from '$lib/helpers/api.js';

export async function GET({request, locals, url}) {
    const response: any = {}

    const assets = await locals.api.getAssets({perPage: 100})
    console.log(assets)

    return respond(assets.status, assets.message, assets.data.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.formData();

    if(url.searchParams.get('id')) {
        const id = url.searchParams.get('id');
        const res = await locals.api.updateAsset(id, body);

        return respond(res.status, res.message, res.data)
    }

    // upload file
    	const res = await locals.api.uploadFile(body);
    
    return respond(res.status, res.message, res.data)
}