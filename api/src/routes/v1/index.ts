import express, { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'
import {
  PasswordSchema,
  PasswordSchemaType,
  VerifySchema,
  VerifySchemaType,
  TokenSchema,
  TokenSchemaType,
  OtpUrlSchema,
  OtpUrlSchemaType,
} from '#lib'
import { errorMiddleware } from 'src/middlewares/error'
import { loggerMiddleware } from 'src/middlewares/logger'
import {
  createHashedToken,
  formatSchemaErrorMessages,
  generateHashedPassword,
  isPasswordCorrect,
  log,
} from '#utils'
const router = express.Router()
router
  .route('/password/hash')
  .post(
    (
      req: Request<object, object, PasswordSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = PasswordSchema.safeParse(req.body)
        if (!result.success) {
          const invalidFieldsMessage = formatSchemaErrorMessages(
            result.error.issues
          )
          res.status(400).json({ error: invalidFieldsMessage, message: null })
          return
        }
        const data = generateHashedPassword(result.data.plainTextPassword)
        res.status(200).json(data)
        return
      } catch (err) {
        next(err)
      }
    }
  )
router
  .route('/password/verify')
  .post(
    (
      req: Request<object, object, VerifySchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = VerifySchema.safeParse(req.body)
        log.debug(JSON.stringify(result))
        if (!result.success) {
          const invalidFieldsMessage = formatSchemaErrorMessages(
            result.error.issues
          )
          res.status(400).json({ error: invalidFieldsMessage, message: null })
          return
        }
        const { storedHashedPassword, storedSalt, plainTextPassword } =
          result.data
        const isCorrect = isPasswordCorrect(
          plainTextPassword,
          storedHashedPassword,
          storedSalt
        )
        res.status(200).json({ isPasswordCorrect: isCorrect })
        return
      } catch (err) {
        next(err)
      }
    }
  )

router
  .route('/generate/hashed-token')
  .post(
    (
      req: Request<object, object, TokenSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = TokenSchema.safeParse(req.body)
        if (!result.success) {
          const invalidFieldsMessage = formatSchemaErrorMessages(
            result.error.issues
          )
          res.status(400).json({ error: invalidFieldsMessage, message: null })
          return
        }
        const token = createHashedToken(result.data.token)
        res.status(200).json({ token })
        return
      } catch (err) {
        next(err)
      }
    }
  )

router
  .route('/generate/salt')
  .post((req: Request, res: Response, next: NextFunction) => {
    try {
      const salt = crypto.randomBytes(16).toString('hex')
      res.status(200).json({ salt })
    } catch (err) {
      next(err)
    }
  })
router
  .route('/generate/otp/code')
  .post(
    (
      req: Request<object, object, OtpUrlSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = OtpUrlSchema.safeParse(req.body)
        if (!result.success) {
          const invalidFieldsMessage = formatSchemaErrorMessages(
            result.error.issues
          )
          res.status(400).json({ error: invalidFieldsMessage, message: null })
          return
        }
        const bytes = result.data.bytes
        const otp = crypto.randomBytes(bytes).toString('hex')
        res.status(200).json({ otp })
      } catch (err) {
        next(err)
      }
    }
  )
router
  .route('/generate/otp/url')
  .post((req: Request, res: Response, next: NextFunction) => {
    try {
      const otp = crypto.randomInt(100000, 999999)
      res.status(200).json({ otp })
    } catch (err) {
      next(err)
    }
  })

router.use(loggerMiddleware)
router.use(errorMiddleware)
export default router
