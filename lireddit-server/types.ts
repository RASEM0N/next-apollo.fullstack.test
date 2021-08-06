import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'
import { Request, Response, Express } from 'express'

export interface MyContext {
    req: Request & { session: any }
    res: Response
    em: EntityManager<IDatabaseDriver<Connection>>
}