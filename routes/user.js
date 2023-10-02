import express from 'express'
import { changePassword, createTrader, login } from '../controllers/authentication.js'
import { isUser } from '../middleware/user_validator/userValidator.js'
import { isAuthorizeToCreateUser } from '../middleware/master_validator/master_validator.js'

const router = express.Router()

router.post('/register', isAuthorizeToCreateUser, createTrader)
router.post('/login', login)

router.put('/change/password', isUser, changePassword)
export default router
