import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response'
import config from "../utils/env"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) errorResponse(res, "token tidak ditemukan", 401)

    const token = authHeader?.split(" ")[1]

    try {
        const payload = jwt.verify(token!, config.JWT_SECRET) as { id : string }

        req.user = payload
        next()
    } catch (error){
        errorResponse (res, "token tidak valid", 401)
    }
}