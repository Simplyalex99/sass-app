import express, { Response, Request } from 'express'
import { createUserByEmailController } from '#controllers'
import { RegisterUserSchemaType } from '#lib'

export type RegisterUserBody = {
  error?: string
}
const router = express.Router()

router
  .route('/register')
  .post(
    (
      req: Request<object, object, RegisterUserSchemaType>,
      res: Response<RegisterUserBody>
    ) => {
      createUserByEmailController(req, res)
    }
  )
export default router
