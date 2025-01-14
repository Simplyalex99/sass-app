import { Request, Response } from 'express'
import { AppError } from '#lib'
export const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Internal Server Error' })
}
