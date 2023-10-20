import { errorHelper } from '../../helper/errorHelper.js'
import { UserModel } from './model.js'
import messages from '../../utilities/messages.js'
import { sendBadRequest, sendSuccess } from '../../utilities/response/index.js'
import bcrypt from 'bcrypt'
import config from '../../config/index.js'
import logger from '../../utilities/logger.js'
import { generateAccessToken, tokenId } from '../../helper/accessTokenHelper.js'
import { generateRefreshToken } from '../../helper/refreshTokenHelper.js'
import constant from '../../utilities/constant.js'
import { ExchangeModel } from '../exchange/model.js'
import { adminIsAccessible, checkUpdater } from '../../middleware/admin_validatior/admin_validator.js'

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
    return sendBadRequest(res, errorHelper(e, 'CHANGE_PASSWORD'))
  }
}

const createUser = async (data, createdId) => {
  const user = await UserModel.findOne({ ID: data.ID })
  if (user) return false
  const userData = {}
  if (data.allowedExchange) {
    await data?.allowedExchange?.forEach((i) => {
      const exchange = ExchangeModel.findOne({ _id: i })
      if (!exchange) { return false }
      // return sendBadRequest(, messages.exchangeNotFound)
    })
    userData.allowedExchange = data.allowedExchange
  }
  const setUserProperties = async (userData, data, createdId) => {
    userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
    userData.name = data?.name?.toString().trim() ? data.name : undefined
    userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
    userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
    userData.role = data.role
    userData.createdBy = createdId
    userData.exchangeGroup = data?.exchangeGroup
    userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
    userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
    return userData
  }
  switch (data.role) {
    case constant.ROLE[1]:
      await setUserProperties(userData, data, createdId)
      userData.Domain = data?.Domain?.toString().trim() ? data.Domain : undefined
      userData.limitOfAddSuperMaster = !isNaN(data?.limitOfAddSuperMaster) ? data.limitOfAddSuperMaster : undefined
      userData.limitOfAddMaster = !isNaN(data?.limitOfAddMaster) ? data.limitOfAddMaster : undefined
      userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
      userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
      userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
      userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
      await new UserModel(userData).save()
      return true
    case constant.ROLE[2]:
      await setUserProperties(userData, data, createdId)
      userData.limitOfAddMaster = !isNaN(data?.limitOfAddMaster) ? data.limitOfAddMaster : undefined
      userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
      userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
      userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
      userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
      await new UserModel(userData).save()
      return true
    case constant.ROLE[3]:
      await setUserProperties(userData, data, createdId)
      userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
      userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
      userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
      userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
      await new UserModel(userData).save()
      return true
    case constant.ROLE[4]:
      await setUserProperties(userData, data, createdId)
      userData.investorPassword = data?.investorPassword?.toString().trim() ? bcrypt.hashSync(data.investorPassword, 10) : undefined
      userData.brokerage = !isNaN(data?.brokerage) ? data?.brokerage : undefined
      await new UserModel(userData).save()
      return true
    default:
      return false
  }
}

// create broker
export const createMaster = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data, req.superMaster ? req.superMaster : req.admin)
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_BROKER'))
  }
}

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
    return sendBadRequest(res, errorHelper(e, 'CHECK_ID'))
  }
}

// create admin
export const createAdmin = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data, req.superAdmin._id)
    if (!user) return sendBadRequest(res, messages.adminAlreadyExist)
    return sendSuccess(res, {}, messages.adminAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_ADMIN'))
  }
}

// create Super broker
export const createSuperMaster = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data, req.admin._id)
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_SUPER_BROKER'))
  }
}

// create user
export const createTrader = async (req, res) => {
  try {
    const data = req.body
    let adminDetails = {}
    switch (true) {
      case Boolean(req.master):
        adminDetails = req.master
        break
      case Boolean(req.superMaster):
        adminDetails = req.superMaster
        break
      default:
        adminDetails = req.admin
    }
    const user = await createUser(data, adminDetails)
    if (!user) return sendBadRequest(res, messages.userAlreadyExist)
    return sendSuccess(res, {}, messages.userAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_USER'))
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
    return sendSuccess(res, { id: user.id, accessToken, refreshToken, role: user.role }, messages.adminLoggedIn)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'LOGIN'))
  }
}

export const updateNameByParent = async (req, res, next) => {
  try {
    const data = req.body
    const userDetails = await UserModel.findOne({ _id: req.query.id })
    if (!userDetails) return sendBadRequest(res, messages.userNotFound)
    const admin = req.user ?? req.superAdmin ?? req.admin ?? req.master ?? req.superMaster
    if (!(await checkUpdater(admin.role, userDetails?.role))) {
      return sendBadRequest(res, messages.YouAreNotAccessibleToDoThis)
    }
    if (!(await adminIsAccessible(admin._id, userDetails.createdBy))) {
      return sendBadRequest(res, messages.YouAreNotAuthenticated)
    }
    const checkForName = await UserModel.findOne({ name: data?.name })
    if (checkForName) return sendBadRequest(res, messages.ThisNameIsAlreadyTaken)
    userDetails.name = data?.name
    await userDetails.save()
    return sendSuccess(res, messages.NameUpdated)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'UPDATE_NAME_BY_PARENT'))
  }
}

export const updateName = async (req, res) => {
  try {
    const data = req.body
    const userDetails = await UserModel.findOne({ _id: req?.user?._id ?? req?.superAdmin?._id ?? req?.admin?._id ?? req?.master?._id ?? req?.superMaster?._id })
    if (!userDetails) return sendBadRequest(res, messages.userNotFound)
    const checkForName = await UserModel.findOne({ name: data?.name })
    if (checkForName) return sendBadRequest(res, messages.ThisNameIsAlreadyTaken)
    userDetails.name = data?.name
    await userDetails.save()
    return sendSuccess(res, messages.NameUpdated)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'UPDATE_NAME_SELF'))
  }
}
