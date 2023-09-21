import express from 'express'
import { changePassword, createAdmin } from '../controllers/authentication.js'
import { isAdmin } from '../middleware/admin_validatior/admin_validator.js'

const router = express.Router()

router.post('/', createAdmin)

router.put('/change/password', isAdmin, changePassword)
export default router
