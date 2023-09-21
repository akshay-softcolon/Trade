import express from 'express'
import { changePassword, createSuperBroker } from '../controllers/authentication.js'
import { isSuperMaster } from '../middleware/master_validator/master_validator.js'

const router = express.Router()

router.post('/', createSuperBroker)

router.put('/change/password', isSuperMaster, changePassword)
export default router
