import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware'
const router = express.Router()

router.use(authMiddleware)
export default router
