import express, { Express, Response } from 'express'
import authRouter from './routes/v1/auth'
import publicRouter from './routes/v1'
import cookieParser from 'cookie-parser'
import { connectRedis } from '#config'
import { errorMiddleware } from './middlewares/error'
import { rateLimiterMiddleware } from './middlewares/rateLimiter'
import { loggerMiddleware } from './middlewares/logger'
import { log } from '#utils'
import cors from 'cors'
const app: Express = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    optionsSuccessStatus: 200,
    credentials: true,
  })
)

connectRedis()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.post('/tokens', (req, res: Response) => {
  log.debug('/tokens')

  const access = req?.cookies['accessToken']
  log.debug(access)
  res.status(200).send()
})

app.use(rateLimiterMiddleware)
app.use('/api/v1', publicRouter)
app.use('/api/v1', authRouter)
app.use(loggerMiddleware)
app.use(errorMiddleware)

export default app
