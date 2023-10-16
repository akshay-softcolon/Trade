import express from 'express'
import { changePassword, createAdmin, createMaster, createSuperMaster, createTrader, login, updateName, updateNameByParent } from './controller.js'
import { isAdmin, isSuperAdmin, isSuperAdminWithUser } from '../../middleware/admin_validatior/admin_validator.js'
import { isAuthorizeToCreateMaster, isAuthorizeToCreateUser, isMaster, isSuperMaster } from '../../middleware/master_validator/master_validator.js'
import { isUser } from '../../middleware/user_validator/userValidator.js'
import { check, query } from 'express-validator'
import { validateField } from '../../middleware/field_validator/index.js'
import messages from '../../utilities/messages.js'

const router = express.Router()
// 1 admin

router.post('/admin', isSuperAdmin, [
  check('name').exists().withMessage(messages.nameIsRequired),
  check('ID').exists().withMessage(messages.IDIsRequired),
  check('password').exists().withMessage(messages.passwordIsRequired),
  check('Domain').exists().withMessage(messages.DomainIsRequired),
  check('allowedExchange').exists().withMessage(messages.allowedExchangeIsRequired),
  check('exchangeGroup').exists().withMessage(messages.exchangeGroupIsRequired),
  check('leverageX').exists().withMessage(messages.leverageXIsRequired),
  check('leverageY').exists().withMessage(messages.leverageYIsRequired),
  check('insertCustomBet').exists().withMessage(messages.insertCustomBetIsRequired),
  check('editBet').exists().withMessage(messages.editBetIsRequired),
  check('deleteBet').exists().withMessage(messages.deleteBetIsRequired),
  check('limitOfAddSuperMaster').exists().withMessage(messages.limitOfAddSuperMasterIsRequired),
  check('limitOfAddMaster').exists().withMessage(messages.limitOfAddMasterIsRequired),
  check('limitOfAddUser').exists().withMessage(messages.limitOfAddUserIsRequired)
],
validateField, createAdmin)

router.put('/admin/change/password', isAdmin, changePassword)

// 2 master

router.post('/master', isAuthorizeToCreateMaster, [
  check('name').exists().withMessage(messages.nameIsRequired),
  check('ID').exists().withMessage(messages.IDIsRequired),
  check('password').exists().withMessage(messages.passwordIsRequired),
  check('allowedExchange').exists().withMessage(messages.allowedExchangeIsRequired),
  check('exchangeGroup').exists().withMessage(messages.exchangeGroupIsRequired),
  check('leverageX').exists().withMessage(messages.leverageXIsRequired),
  check('leverageY').exists().withMessage(messages.leverageYIsRequired),
  check('insertCustomBet').exists().withMessage(messages.insertCustomBetIsRequired),
  check('editBet').exists().withMessage(messages.editBetIsRequired),
  check('deleteBet').exists().withMessage(messages.deleteBetIsRequired),
  check('limitOfAddUser').exists().withMessage(messages.limitOfAddUserIsRequired)
],
validateField, createMaster)

router.put('/master/change/password', isMaster, changePassword)

// 3 super master

router.post('/super/master/', isAdmin, [
  check('name').exists().withMessage(messages.nameIsRequired),
  check('ID').exists().withMessage(messages.IDIsRequired),
  check('password').exists().withMessage(messages.passwordIsRequired),
  check('allowedExchange').exists().withMessage(messages.allowedExchangeIsRequired),
  check('exchangeGroup').exists().withMessage(messages.exchangeGroupIsRequired),
  check('leverageX').exists().withMessage(messages.leverageXIsRequired),
  check('leverageY').exists().withMessage(messages.leverageYIsRequired),
  check('insertCustomBet').exists().withMessage(messages.insertCustomBetIsRequired),
  check('editBet').exists().withMessage(messages.editBetIsRequired),
  check('deleteBet').exists().withMessage(messages.deleteBetIsRequired),
  check('limitOfAddMaster').exists().withMessage(messages.limitOfAddMasterIsRequired),
  check('limitOfAddUser').exists().withMessage(messages.limitOfAddUserIsRequired)
],
validateField, createSuperMaster)

router.put('/change/password', isSuperMaster, changePassword)

// 4 user

router.post('/user/register', isAuthorizeToCreateUser, [
  check('name').exists().withMessage(messages.nameIsRequired),
  check('ID').exists().withMessage(messages.IDIsRequired),
  check('password').exists().withMessage(messages.passwordIsRequired),
  check('allowedExchange').exists().withMessage(messages.allowedExchangeIsRequired),
  check('exchangeGroup').exists().withMessage(messages.exchangeGroupIsRequired),
  check('leverageX').exists().withMessage(messages.leverageXIsRequired),
  check('leverageY').exists().withMessage(messages.leverageYIsRequired),
  check('brokerage').exists().withMessage(messages.brokerageIsRequired),
  check('investorPassword').exists().withMessage(messages.investorPasswordIsRequired)
],
validateField, createTrader)

router.post('/user/login', login)

router.put('/user/change/password', isUser, changePassword)

router.put('/update/name', isAuthorizeToCreateUser, [
  check('id').exists().withMessage(messages.IDIsRequired),
  check('name').exists().withMessage(messages.nameIsRequired)
],
validateField, updateNameByParent)

router.put('/update/name/user', isSuperAdminWithUser, [
  check('name').exists().withMessage(messages.nameIsRequired)
],
validateField, updateName)

export default router
