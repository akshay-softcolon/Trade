import express from 'express'
import healthRoute from './health/index.js'
import masterRoute from './master.js'
import superMasterRoute from './superMaster.js'
import adminRoute from './admin.js'
import userRoute from './user.js'

const router = express.Router()

/* GET home page. */

// like router use like this
router.use('/health', healthRoute)
router.use('/user', userRoute)
router.use('/admin', adminRoute)
router.use('/master', masterRoute)
router.use('/super/master', superMasterRoute)

export default router
