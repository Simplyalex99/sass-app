import express, { Response, Request } from 'express'
import { createUserByEmailController } from '#controllers'
import { UserResponseBody } from '../../../../shared/api'
const router = express.Router()

router
  .route('/register')
  .post(
    (
      req: Request<{ email: string; plainTextPassword: string }>,
      res: Response<UserResponseBody>
    ) => {
      return createUserByEmailController(req, res)
    }
  )
export default router
