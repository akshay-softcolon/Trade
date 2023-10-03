import express from 'express'
import { changePassword, createAdmin, createMaster, createSuperMaster, createTrader, login } from './controller.js'
import { isAdmin, isSuperAdmin } from '../../middleware/admin_validatior/admin_validator.js'
import { isAuthorizeToCreateUser, isMaster, isSuperMaster } from '../../middleware/master_validator/master_validator.js'
import { isUser } from '../../middleware/user_validator/userValidator.js'

const router = express.Router()
// 1 admin

router.post('/admin', isSuperAdmin, createAdmin)

router.put('/admin/change/password', isAdmin, changePassword)

// 2 master

router.post('/master', isAdmin, createMaster)

router.put('/master/change/password', isMaster, changePassword)

// 3 super master

router.post('/super/master/', isAdmin, createSuperMaster)

router.put('/change/password', isSuperMaster, changePassword)

// 4 user

router.post('/user/register', isAuthorizeToCreateUser, createTrader)

router.post('/user/login', login)

router.put('/user/change/password', isUser, changePassword)

export default router
