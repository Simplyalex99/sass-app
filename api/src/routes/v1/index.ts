import express, { Request, Response } from 'express'
import {
  sendEmailValidationController,
  verifyEmailController,
  loginController,
  createUserByEmailController,
} from '#controllers'
import {
  SendEmailSchemaType,
  MagicLinkSchemaType,
  LoginUserSchemaType,
  RegisterUserSchemaType,
} from '#lib'
import {
  SendEmailBody,
  VerifyEmailBody,
  RegisterUserBody,
} from '../../../../shared/api'

const router = express.Router()
router
  .route('/email/request')
  .post(
    (
      req: Request<object, object, SendEmailSchemaType>,
      res: Response<SendEmailBody>
    ) => {
      sendEmailValidationController(req, res)
    }
  )

router
  .route('/email/verify')
  .post(
    (
      req: Request<object, object, MagicLinkSchemaType>,
      res: Response<VerifyEmailBody>
    ) => {
      verifyEmailController(req, res)
    }
  )
router
  .route('/login')
  .post((req: Request<object, object, LoginUserSchemaType>, res) => {
    loginController(req, res)
  })

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

router.route('/auth/google/callback').post()

export default router
