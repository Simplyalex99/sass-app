import express, { Express } from 'express'
import publicRouter from './routes/v1'
import cookieParser from 'cookie-parser'

import { errorMiddleware } from './middlewares/error'
import { loggerMiddleware } from './middlewares/logger'

import cors from 'cors'
const app: Express = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    optionsSuccessStatus: 200,
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', publicRouter)
app.use(loggerMiddleware)
app.use(errorMiddleware)

export default app
