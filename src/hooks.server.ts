import {connect} from '@ulibs/db'
import { existsSync, fstat, fstatSync, mkdirSync } from 'fs'

export const handle = async ({event, resolve}) => {

    const siteId = '123123'

    // get model based on domain
    const {getModel} = connect({filename: 'data/' + siteId + '/db.json'}) // based on url
    event.locals.db = (table: string) => getModel(table)

    if(!existsSync('data/' + siteId)) {

        mkdirSync('data/' + siteId, {recursive: true})
        mkdirSync('data/' + siteId + '/assets', {recursive: true})
    }
    
    event.locals.siteId = siteId
    
    
    return resolve(event)
}