import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../config/index.js'
export const generateAccessToken = (data, role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return jwt.sign(data, config.SUPER_ADMIN_SECRET, { expiresIn: '30m' })
    case 'ADMIN':
      return jwt.sign(data, config.ADMIN_SECRET, { expiresIn: '30m' })
    case 'SUPER_BROKER':
      return jwt.sign(data, config.SUPER_BROKER_SECRET, { expiresIn: '30m' })
    case 'BROKER':
      return jwt.sign(data, config.BROKER_SECRET, { expiresIn: '30m' })
    case 'USER':
      return jwt.sign(data, config.USER_SECRET, { expiresIn: '30m' })
    default:
      return null
  }
}

export const tokenId = () => {
  return crypto.randomBytes(16).toString('hex')
}

export const validateAccessToken = async (token, role) => {
  try {
    const tokenInfo = await jwt.verify(token, config[`${role}_SECRET`])
    return tokenInfo
  } catch (e) {
    return null
  }
}
