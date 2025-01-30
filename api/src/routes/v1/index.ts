import express from 'express'

const router = express.Router()

router.route('/auth/google/callback').post()

export default router
