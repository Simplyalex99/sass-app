import { NextFunction, Request, Response } from 'express'
import { log } from '../utils/others/log'
import { AppError } from '../lib/errors/app'
export const loggerMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error && err.stack) {
    log.error('%O', err)
  }
  next()
}
