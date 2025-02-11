import express, { Request, Response } from 'express'
import {
  sendEmailValidationController,
  verifyEmailController,
  loginController,
  createUserByEmailController,
  logoutController,
} from '#controllers'
import {
  SendEmailSchemaType,
  MagicLinkSchemaType,
  LoginSchemaType,
  LogoutSchemaType,
  RegisterUserSchemaType,
} from '#lib'

const router = express.Router()
router
  .route('/email/request')
  .post((req: Request<object, object, SendEmailSchemaType>, res: Response) => {
    sendEmailValidationController(req, res)
  })

router
  .route('/email/verify')
  .post((req: Request<object, object, MagicLinkSchemaType>, res: Response) => {
    verifyEmailController(req, res)
  })
router
  .route('/sign-in')
  .post((req: Request<object, object, LoginSchemaType>, res: Response) => {
    loginController(req, res)
  })
router
  .route('/sign-out')
  .post((req: Request<object, object, LogoutSchemaType>, res: Response) => {
    logoutController(req, res)
  })
router
  .route('/register')
  .post(
    (req: Request<object, object, RegisterUserSchemaType>, res: Response) => {
      createUserByEmailController(req, res)
    }
  )

router.route('/auth/google/callback').post()

export default router
