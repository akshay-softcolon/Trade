import express from 'express'
import { check } from 'express-validator'
import { isSuperAdmin } from '../../middleware/admin_validatior/admin_validator.js'
import messages from '../../utilities/messages.js'
import { createSymbol, deleteSymbol, getSymbol, updateSymbol } from './controller.js'
import { validateField } from '../../middleware/field_validator/index.js'

const router = express.Router()

router.post('/create', isSuperAdmin, [
  check('name').exists().withMessage(messages.symbolNameIsRequired)
], validateField, createSymbol)

router.put('/update/:symbolId', isSuperAdmin, updateSymbol)

router.get('/get', isSuperAdmin, getSymbol)

router.delete('/delete/:symbolId', isSuperAdmin, deleteSymbol)

export default router
