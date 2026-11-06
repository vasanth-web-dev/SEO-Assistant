import { Router } from 'express'
import { postAnalyze } from '../controllers/analyzeController.js'

const router = Router()

router.post('/', postAnalyze)

export default router
