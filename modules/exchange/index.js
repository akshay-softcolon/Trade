import express from 'express'
import { check } from 'express-validator'
import { isSuperAdmin } from '../../middleware/admin_validatior/admin_validator.js'
import messages from '../../utilities/messages.js'
import { validateField } from '../../middleware/field_validator/index.js'
import { createExchange, deleteExchange, exchangeInAddSymbols, exchangeInRemoveSymbols, getExchange, updateExchange } from './controller.js'

const router = express.Router()

router.post('/create', isSuperAdmin, [
  check('name').exists().withMessage(messages.exchangeNameIsRequired)
], validateField, createExchange)

router.put('/update/:exchangeId', isSuperAdmin, updateExchange)

router.get('/get', isSuperAdmin, getExchange)

router.delete('/delete/:exchangeId', isSuperAdmin, deleteExchange)

router.put('/add_symbol/:exchangeId', isSuperAdmin, exchangeInAddSymbols)

router.put('/remove_symbol/:exchangeId', isSuperAdmin, exchangeInRemoveSymbols)

export default router
