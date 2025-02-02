import express, { Response, Request } from 'express'
import { createUserByEmailController } from '#controllers'
import { RegisterUserSchemaType } from '#lib'
import { RegisterUserBody } from '../../../../shared/api'

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
