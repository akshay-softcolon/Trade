import express from 'express'
import { changePassword, createMaster } from '../controllers/authentication.js'
import { isMaster } from '../middleware/master_validator/master_validator.js'
import { isAdmin } from '../middleware/admin_validatior/admin_validator.js'

const router = express.Router()

router.post('/', isAdmin, createMaster)

router.put('/change/password', isMaster, changePassword)
export default router
