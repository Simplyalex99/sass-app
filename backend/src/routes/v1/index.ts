import express from 'express'

// this should handle all generic routes
const router = express.Router()

router.route('/auth/google/callback').post()

export default router
