import { Request, Response, NextFunction } from 'express'
import { ratelimit } from '../config/ratelimit'
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIP = req.ip || '127.0.0.1'
  const { success } = await ratelimit.limit(userIP)

  if (!success) {
    res.status(429).json({ error: 'Too many requests' })
  }
  next()
}
