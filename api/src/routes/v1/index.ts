import express, { Request, Response } from 'express'
import {
  sendEmailValidationController,
  verifyEmailController,
} from '#controllers'
import { SendEmailSchemaType, VerifyEmailSchemaType } from '#lib'
import { SendEmailBody, VerifyEmailBody } from '../../../../shared/api'
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
      req: Request<object, object, VerifyEmailSchemaType>,
      res: Response<VerifyEmailBody>
    ) => {
      verifyEmailController(req, res)
    }
  )

router.route('/auth/google/callback').post()

export default router
