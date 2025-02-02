import express, { Request, Response } from 'express'
import { sendEmailValidationController } from '#controllers'
import { SendEmailSchemaType } from '#lib'
import { SendEmailBody } from '#types'
const router = express.Router()
router
  .route('/email/resend')
  .post(
    (
      req: Request<object, object, SendEmailSchemaType>,
      res: Response<SendEmailBody>
    ) => {
      sendEmailValidationController(req, res)
    }
  )

router.route('/email/verify').post(() => {})

router.route('/auth/google/callback').post()

export default router
