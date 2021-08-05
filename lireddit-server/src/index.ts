import dotenv from 'dotenv'

dotenv.config({
    path: '.env',
})
import { MikroORM } from '@mikro-orm/core'
import { Post } from 'entities/Post'
import microConfig from './mikro-orm.config'

// const main = async () => {
//     const orm = await MikroORM.init(microConfig)
//
//     const post = orm.em.create(Post, { title: 'my first post' })
//     await orm.em.persistAndFlush(post)
//     await orm.em.nativeInsert(Post, { title: 'my first post' })
// }
//
// main().catch((e) => {
//     console.error(e.message)
// })
