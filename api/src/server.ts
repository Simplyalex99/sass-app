import express, { Express } from 'express'
import authRouter from './routes/v1/auth'
import publicRouter from './routes/v1'
import cookieParser from 'cookie-parser'
import { connectRedis } from '#config'
import { errorMiddleware } from './middlewares/error'
import { rateLimiterMiddleware } from './middlewares/rateLimiter'
import { loggerMiddleware } from './middlewares/logger'
const app: Express = express()

connectRedis()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiterMiddleware)
app.use('/api/v1', publicRouter)
app.use('/api/v1', authRouter)
app.use(loggerMiddleware)
app.use(errorMiddleware)

export default app
