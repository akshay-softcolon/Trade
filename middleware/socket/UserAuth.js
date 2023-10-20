import jwt from 'jsonwebtoken'
import messages from '../../utilities/messages.js'
import config from '../../config/index.js'
import logger from '../../utilities/logger.js'
import { validateAccessToken } from '../../helper/accessTokenHelper.js'

// import mongoose from 'mongoose'

// export const isValidUser = async (socket, next) => { // Validate Socket connection bearer token
//   try {
//     if (!(socket.handshake.auth && socket.handshake.auth.authorization)) return next(new Error('Authentication error')) // Auth token required
//
//     const tokenInfo = await jwt.verify( // Verify Token
//       String(socket.handshake.auth.authorization),
//       config.SECRET_USER
//     )
//
//     if (!(tokenInfo && tokenInfo._id)) return next(new Error(messages.tokenFormatInvalid)) // Validate token
//
//     if (socket.handshake.query?.user && !mongoose.Types.ObjectId.isValid(socket.handshake.query.user)) return next(new Error('Valid User ID Required'))
//     // socket.userId = tokenInfo._id
//     socket.userId = socket.handshake.query.user
//     next()
//   } catch (e) {
//     if (String(e).includes('jwt expired')) {
//       return next(new Error(messages.tokenExpiredError))
//     } else if (String(e).includes('invalid token')) {
//       return next(new Error(messages.invalidToken))
//     } else if (String(e).includes('jwt malformed')) {
//       return next(new Error(messages.invalidToken))
//     }
//     logger.error('IS_ADMIN')
//     logger.error(e)
//     next(new Error('Authentication error'))
//   }
// }

export const isValidUser = async (socket, next) => { // Validate Socket connection bearer token
  try {
    if (socket.handshake.auth.authorization) {
      // if (!(socket.handshake.headers && socket.handshake.headers.authorization)) return next(new Error('Authentication error')) // Auth token required
      if (!(socket.handshake.auth && socket.handshake.auth.authorization)) return next(new Error('Authentication error')) // Auth token required

      const tokenInfo = await validateAccessToken(String(socket.handshake.auth.authorization).split(' ')[1], 'USER')

      if (!(tokenInfo && tokenInfo._id)) return next(new Error(messages.tokenFormatInvalid)) // Validate token

      // if (socket.handshake.tokenInfo._id && !mongoose.Types.ObjectId.isValid(socket.handshake.tokenInfo._id)) return next(new Error('Valid User ID Required'))
      socket.userId = tokenInfo._id
      next()
    }

    if (socket.handshake.headers.authorization) {
      // if (!(socket.handshake.headers && socket.handshake.headers.authorization)) return next(new Error('Authentication error')) // Auth token required
      if (!(socket.handshake.headers && socket.handshake.headers.authorization)) return next(new Error('Authentication error')) // Auth token required
      console.log(socket.handshake.headers.authorization)
      const tokenInfo = await validateAccessToken(String(socket.handshake.headers.authorization).split(' ')[1], 'SUPER_ADMIN')
      console.log('tokenInfo', tokenInfo)

      if (!(tokenInfo && tokenInfo._id)) return next(new Error(messages.tokenFormatInvalid)) // Validate token

      // if (socket.handshake.tokenInfo._id && !mongoose.Types.ObjectId.isValid(socket.handshake.tokenInfo._id)) return next(new Error('Valid User ID Required'))
      socket.userId = tokenInfo._id
      next()
    }

    // if (socket.userId !== tokenInfo._id) return next(new Error(messages.tokenExpiredError))
  } catch (e) {
    if (String(e).includes('jwt expired')) {
      return next(new Error(messages.tokenExpiredError))
    } else if (String(e).includes('invalid token')) {
      return next(new Error(messages.invalidToken))
    } else if (String(e).includes('jwt malformed')) {
      return next(new Error(messages.invalidToken))
    }
    logger.error('IS_USER')
    logger.error(e)
    next(new Error('Authentication error'))
    console.log(e)
  }
}
