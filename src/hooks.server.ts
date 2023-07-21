import { db } from '$lib/server'

export const handle = async ({event, resolve}) => {

    const users = db.getModel<User>('users')


    console.log(users)
    
    return resolve(event)
}