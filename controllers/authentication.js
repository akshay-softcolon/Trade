import config from '../config/index.js'
import { UserModel } from '../modals/index.js'
import logger from '../utilities/logger.js'
import bcrypt from 'bcrypt'
import { sendBadRequest, sendSuccess } from '../utilities/response/index.js'
import messages from '../utilities/messages.js'
import { generateAccessToken, tokenId } from '../helper/accessTokenHelper.js'
import { generateRefreshToken } from '../helper/refreshTokenHelper.js'

export const createMainAdmin = async () => {
  try {
    const admin = await UserModel.findOne({ ID: config.ADMIN_ID })
    if (!admin) {
      const adminData = {
        firstName: 'Super',
        lastName: 'Admin',
        ID: config.ADMIN_ID,
        password: bcrypt.hashSync(config.ADMIN_PASSWORD, 10),
        role: 'SUPER_ADMIN'
      }
      await new UserModel(adminData).save()
    }
  } catch (e) {
    logger.error('CREATE_MAIN_ADMIN')
    logger.error(e)
  }
}

// ID exists or not
export const checkID = async (req, res) => {
  try {
    const admin = await UserModel.findOne({ ID: req.params.ID })
    if (admin) return sendSuccess(res, { exists: true }, messages.idAlreadyExist)
    return sendSuccess(res, { exists: false }, messages.idAvailable)
  } catch (e) {
    logger.error('CHECK_ID')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

const createUser = async (id, password, role) => {
  const user = await UserModel.findOne({ ID: id })
  if (user) return false
  const userData = {
    ID: id,
    password: bcrypt.hashSync(password, 10),
    role
  }
  await new UserModel(userData).save()
  return true
}

// create admin
export const createAdmin = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data.ID, data.password, 'ADMIN')
    if (!user) return sendBadRequest(res, messages.adminAlreadyExist)
    return sendSuccess(res, {}, messages.adminAdded)
  } catch (e) {
    logger.error('CREATE_ADMIN')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

// create Super broker
export const createSuperBroker = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data.ID, data.password, 'SUPER_BROKER')
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    logger.error('CREATE_SUPER_BROKER')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

// create broker
export const createBroker = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data.ID, data.password, 'BROKER')
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    logger.error('CREATE_BROKER')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

// create user
export const createTrader = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data.ID, data.password, 'USER')
    if (!user) return sendBadRequest(res, messages.userAlreadyExist)
    return sendSuccess(res, {}, messages.userAdded)
  } catch (e) {
    logger.error('CREATE_USER')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

// user login
export const login = async (req, res) => {
  try {
    const data = req.body

    const user = await UserModel.findOne({ ID: data.ID })
    if (!user) return sendBadRequest(res, messages.adminNotFound)
    if (!bcrypt.compareSync(data.password, user.password)) return sendBadRequest(res, messages.invalidPassword)
    // if (admin.status === 'INACTIVE') return sendBadRequest(res, messages.accountDeactivated)

    const accessTokenId = tokenId()
    const refreshTokenId = tokenId()
    const accessToken = await generateAccessToken({ _id: user._id, accessTokenId }, user.role)
    const refreshToken = await generateRefreshToken({ _id: user._id, refreshTokenId }, user.role)

    user.accessTokenId = accessTokenId
    user.refreshTokenId = refreshTokenId
    await user.save()
    return sendSuccess(res, { accessToken, refreshToken, role: user.role }, messages.adminLoggedIn)
  } catch (e) {
    console.log(e)
    logger.error('LOGIN')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const changePassword = async (req, res) => {
  try {
    const data = req.body
    const user = await UserModel.findById(req.user._id ?? req.superAdmin._id ?? req.admin._id ?? req.master._id ?? req.superMaster._id)
    if (!user) return sendBadRequest(res, messages.adminNotFound)
    if (!bcrypt.compareSync(data.oldPassword, user.password)) return sendBadRequest(res, messages.invalidPassword)
    user.password = bcrypt.hashSync(data.newPassword, 10)
    await user.save()
    return sendSuccess(res, {}, messages.passwordChanged)
  } catch (e) {
    logger.error('CHANGE_PASSWORD')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
