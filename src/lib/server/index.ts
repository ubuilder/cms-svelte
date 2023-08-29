import { connect, type ConnectType } from '@ulibs/db'

export const db: ReturnType<ConnectType> = connect({
    // client: 'pg',
    filename: './app.db'
    // connection: DATABASE_URI
    // host: DATABASE_HOST,
    // user: DATABASE_USER,
    // password: DATABASE_PASSWORD,
    // database: DATABASE_DB,    
})
