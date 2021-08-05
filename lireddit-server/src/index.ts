import dotenv from 'dotenv'
import express from 'express'
import 'colors'

dotenv.config({
    path: '.env',
})
import { MikroORM } from '@mikro-orm/core'
import microConfig from './mikro-orm.config'
import { loggerIsConnected, loggerServerStarted } from './utils/loggers'

const main = async () => {
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()
    loggerIsConnected(await orm.isConnected())

    const app = express()
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
