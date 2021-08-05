import dotenv from 'dotenv'
import express from 'express'
import 'colors'

dotenv.config({
    path: '.env',
})

import { ApolloServer } from 'apollo-server-express'
import { MikroORM } from '@mikro-orm/core'
import microConfig from './mikro-orm.config'
import { loggerIsConnected, loggerServerStarted } from './utils/loggers'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { __prod__ } from './constants'

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()
    loggerIsConnected(await orm.isConnected())

    const app = express()

    const apolloServer = new ApolloServer({
        introspection: !__prod__,
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false,
        }),
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({
        app,
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
    console.error(e)
})
