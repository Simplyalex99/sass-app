import express, { Response, NextFunction, Request } from 'express'
import { authMiddleware } from '../../middlewares/auth'
import { logoutController } from '#controllers'
import { LogoutSchemaType } from '#lib'
const router = express.Router()

router.use(authMiddleware)
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
export default router
