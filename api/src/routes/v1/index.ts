import express, { NextFunction, Request, Response } from 'express'
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
import { errorMiddleware } from 'src/middlewares/errorMiddleware'
import { loggerMiddleware } from 'src/middlewares/loggerMiddleware'
const router = express.Router()
router
  .route('/email/request')
  .post(
    (
      req: Request<object, object, SendEmailSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      sendEmailValidationController(req, res, next)
    }
  )

router
  .route('/email/verify')
  .post(
    (
      req: Request<object, object, MagicLinkSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      verifyEmailController(req, res, next)
    }
  )
router
  .route('/sign-in')
  .post(
    (
      req: Request<object, object, LoginSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      loginController(req, res, next)
    }
  )
router
  .route('/sign-out')
  .post(
    (
      req: Request<object, object, LogoutSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      logoutController(req, res, next)
    }
  )
router
  .route('/register')
  .post(
    (
      req: Request<object, object, RegisterUserSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      createUserByEmailController(req, res, next)
    }
  )

router.route('/auth/google/callback').post()
router.use(loggerMiddleware)
router.use(errorMiddleware)
export default router
