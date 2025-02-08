import { Request, Response } from 'express'
import { AppError } from '#lib'
export const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).send()
  }
  if (err.stack) {
    res.status(500).send()
  }
  res.status(404).json({ error: 'Page not found' })
}
