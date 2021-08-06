import dotenv from 'dotenv'
import express from 'express'
import 'colors'

dotenv.config({
    path: '.env',
})

import { ApolloServer } from 'apollo-server-express'
import { MikroORM } from '@mikro-orm/core'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import microConfig from './mikro-orm.config'
import { loggerIsConnected, loggerServerStarted } from './utils/loggers'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { __prod__ } from './constants'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'

import cors from 'cors'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from '../types'

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()
    loggerIsConnected(await orm.isConnected())

    const app = express()
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }),
    )

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: false,
            }),
            cookie: {
                maxAge: 1000 * 60 * 3, // 3min
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
        }),
    )

    const apolloServer = new ApolloServer({
        introspection: !__prod__,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            em: orm.em, // прокидываем в @Ctx ресольверов
        }),
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({
        app,
        cors: false,
    })

    const PORT = process.env.PORT || 4001
    const server = app.listen(PORT, () => {
        loggerServerStarted(PORT)
    })
    process.on('unhandledRejection', (reason, _) => {
        console.log(`Error: ${reason}`.red)
        server.close(() => process.exit(1))
    })
}

main().catch((e) => {
    console.error(`${e.message}`.underline.red)
})
