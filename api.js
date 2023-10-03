import express from 'express'
import { authenticate } from './middleware/auth.js'
import { hasAccess } from './middleware/hasAccess.js'

import adminRoute from './modules/admin/index.js'
import symbolRoute from './modules/symbol/index.js'
const router = express.Router()

const handlers = {
  auth: {
    path: adminRoute,
    authenticate: false
  },
  symbol: {
    path: symbolRoute,
    authenticate: false
  }
}

for (const m in handlers) {
  if (handlers[m].authenticate) {
    if (handlers[m].module) {
      router.use(
        '/' + m,
        authenticate,
        hasAccess(handlers[m].module),
        handlers[m].path
      )
    } else {
      router.use('/' + m, authenticate, handlers[m].path)
    }
  } else {
    router.use('/' + m, handlers[m].path)
  }
}

router.use('*', (req, res) => {
  res.send({ code: 400, message: 'API not found' })
})

export default router
