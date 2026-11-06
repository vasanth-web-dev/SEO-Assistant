import { Router } from 'express'
import { postOptimize } from '../controllers/aiController.js'

const router = Router()

router.post('/optimize', postOptimize)

export default router
