import express, { Response, NextFunction, Request } from 'express'
import { authMiddleware } from '../../middlewares/auth'
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
export default router
