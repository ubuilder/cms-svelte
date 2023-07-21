import { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB, DATABASE_URI } from '$env/static/private'
import { connect, type ConnectType } from '@ulibs/db'

export const db: ReturnType<ConnectType> = connect({
    client: 'pg',
    connection: DATABASE_URI
    // host: DATABASE_HOST,
    // user: DATABASE_USER,
    // password: DATABASE_PASSWORD,
    // database: DATABASE_DB,    
})
