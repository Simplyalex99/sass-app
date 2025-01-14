import express, { Express, Response, Request } from 'express'
import authRouter from './routes/v1/auth'
import cookieParser from 'cookie-parser'
import { connectRedis } from '#lib'

const app: Express = express()
const port = 3000
connectRedis()
app.use(express.json())
app.use(cookieParser())
app.post('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use('/api/v1', authRouter)
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
