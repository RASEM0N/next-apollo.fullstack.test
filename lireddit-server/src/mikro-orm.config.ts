import { MikroORM } from '@mikro-orm/core'
import { Post } from './entities/Post'
import path from 'path'
import { __prod__ } from './constants'

export default {
    debug: !__prod__,
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    type: 'postgresql',
    entities: [Post],
    port: !isNaN(Number(process.env.DB_PORT)) ? Number(process.env.DB_PORT) : 5432,
    host: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    password: process.env.DB_USER_PASSWORD,
    user: process.env.DB_USER_NAME,
} as Parameters<typeof MikroORM.init>[0]
