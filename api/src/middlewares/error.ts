/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib/errors/app'
import { INTERNAL_SERVER_ERROR } from '#enums'
export const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error && err.stack !== undefined) {
    res.status(500).json({ error: INTERNAL_SERVER_ERROR })
  }

  res.status(404).json({ error: 'Page not found' })
}
