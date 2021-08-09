import dotenv from 'dotenv'
import express from 'express'
import 'colors'

dotenv.config({
    path: '.env',
})
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { loggerIsConnected, loggerServerStarted } from './utils/loggers'
import { buildSchema } from 'type-graphql'
// import { HelloResolver } from './resolvers/hello'

import { __prod__, COOKIE_NAME } from './constants'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'

import cors from 'cors'
import redis from 'redis'

import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from '../types'
import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'

const main = async () => {
    const connect = await createConnection({
        type: 'postgres',
        database: process.env.DB_NAME,
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [Post, User],
        host: process.env.DB_HOST,
        port: !isNaN(Number(process.env.DB_PORT)) ? Number(process.env.DB_PORT) : 5432,
    })
    loggerIsConnected(connect.isConnected)

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
            name: COOKIE_NAME,
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
            resolvers: [
                // HelloResolver,
                PostResolver,
                UserResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
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
