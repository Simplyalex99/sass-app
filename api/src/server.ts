import express, { Express, Response, Request } from 'express'
import authRouter from './routes/v1/auth'
import cookieParser from 'cookie-parser'
import { connectRedis } from '#lib'
//import { errorMiddleware } from './middlewares/errorMiddleware'
import {} from '#enums'
const app: Express = express()

connectRedis()
app.use(express.json())
app.use(cookieParser())
app.post('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use('/api/v1', authRouter)
//app.use(errorMiddleware)
export default app
