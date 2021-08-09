import { Request, Response } from 'express'

export interface MyContext {
    req: Request & { session: any }
    res: Response
}
