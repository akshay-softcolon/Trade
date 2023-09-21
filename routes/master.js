import express from 'express'
import { changePassword, createBroker } from '../controllers/authentication.js'
import { isMaster } from '../middleware/master_validator/master_validator.js'

const router = express.Router()

router.post('/', createBroker)

router.put('/change/password', isMaster, changePassword)
export default router
