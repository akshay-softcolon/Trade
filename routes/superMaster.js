import express from 'express'
import { changePassword, createSuperMaster } from '../controllers/authentication.js'
import { isSuperMaster } from '../middleware/master_validator/master_validator.js'
import { isAdmin } from '../middleware/admin_validatior/admin_validator.js'

const router = express.Router()

router.post('/', isAdmin, createSuperMaster)

router.put('/change/password', isSuperMaster, changePassword)
export default router
