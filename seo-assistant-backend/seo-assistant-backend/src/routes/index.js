import { Router } from 'express'
import healthRoutes from './healthRoutes.js'
import analyzeRoutes from './analyzeRoutes.js'
import aiRoutes from './aiRoutes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/analyze', analyzeRoutes)
router.use('/ai', aiRoutes)

// Reserved for future phases — not implemented yet, routed here once they exist:
//   router.use('/auth',     authRoutes)      — Phase 4: register/login/logout
//   router.use('/analyses', analysesRoutes)  — Phase 4: saved analyses (MongoDB)

export default router
