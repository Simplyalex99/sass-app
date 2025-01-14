import express, { Response, Request, NextFunction } from 'express'
import { createUserByEmailController } from '#controllers'
const router = express.Router()

router
  .route('/register')
  .post(
    (
      req: Request<{ email: string; plainTextPassword: string }>,
      res: Response,
      next: NextFunction
    ) => {
      createUserByEmailController(req, res, next)
    }
  )
export default router
