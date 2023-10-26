import express from 'express'
import { authenticate } from './middleware/auth.js'
import { hasAccess } from './middleware/hasAccess.js'

import adminRoute from './modules/admin/index.js'
import symbolRoute from './modules/symbol/index.js'
import exchangeRoute from './modules/exchange/index.js'
import { sendBadRequest } from './utilities/response/index.js'

const router = express.Router()

const handlers = {
  auth: {
    path: adminRoute,
    authenticate: false
  },
  symbol: {
    path: symbolRoute,
    authenticate: false
  },
  exchange: {
    path: exchangeRoute,
    authenticate: false
  }
}

for (const m in handlers) {
  if (handlers[m].authenticate) {
    console.log('1')
    if (handlers[m].module) {
      console.log('2')
      router.use(
        '/' + m,
        authenticate,
        hasAccess(handlers[m].module),
        handlers[m].path
      )
      console.log(handlers[m].module)
    } else {
      console.log('3')
      router.use('/' + m, authenticate, handlers[m].path)
    }
  } else {
    router.use('/' + m, handlers[m].path)
  }
}

router.use('*', (req, res) => {
  return sendBadRequest(res, 'API not found')
  // res.send({ code: 400, message: 'API not found' })
})

export default router
