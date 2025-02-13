import express, { Response, NextFunction, Request } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import { errorMiddleware } from '../../middlewares/error'
import { loggerMiddleware } from '../../middlewares/logger'
import { logoutController } from '#controllers'
import { AuthSchemaType } from '#lib'
const router = express.Router()

router.use(authMiddleware)
router
  .route('/sign-out')
  .post(
    (
      req: Request<object, object, AuthSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      logoutController(req, res, next)
    }
  )
router.use(loggerMiddleware)
router.use(errorMiddleware)
export default router
