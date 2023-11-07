import { respond } from '$lib/helpers/api.js';

export async function GET({request, locals, url}) {
    const user = await locals.api.getUser()
      
    return respond(user.status, user.message, user.data)
} 

export async function POST({request, locals, url}) {
    const body = await request.json();

    const res = await locals.api.updateProfile(body)
    
    return respond(res.status, res.message, res.data)
}