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
import { TenantModel } from '../entry/model.js'
import { dbChange, getDBModel, switchDB } from '../../middleware/tenant/db.js'
import mongoose from 'mongoose'

export const changePassword = async (req, res) => {
  try {
    const data = req.body
    const user = await UserModel.findById(req.user._id ?? req.superAdmin._id ?? req.admins._id ?? req.master._id ?? req.superMaster._id)
    if (!user) return sendBadRequest(res, messages.adminNotFound)
    if (!bcrypt.compareSync(data.oldPassword, user.password)) return sendBadRequest(res, messages.invalidPassword)
    user.password = bcrypt.hashSync(data.newPassword, 10)
    await user.save()
    return sendSuccess(res, {}, messages.passwordChanged)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CHANGE_PASSWORD'))
  }
}

const createUser = async (data, tenantId, createdId) => {
  const user = await UserModel.findOne({ ID: data.ID, tenantId })
  if (user) return false
  const userData = {}
  if (data.allowedExchange) {
    const uniqueArray = data.allowedExchange.filter((value, index, self) => {
      return self.indexOf(value) === index
    })
    for (let i = 0; i < uniqueArray.length; i++) {
      const exchange = await ExchangeModel.findOne({ _id: mongoose.Types.ObjectId(uniqueArray[i]) })
      if (!exchange) { return messages.exchangeNotFound }
    }
    userData.allowedExchange = uniqueArray
  }
  const setUserProperties = async (userData, data, tenantId, createdId) => {
    userData.ID = data?.ID?.toString().trim() ? data.ID : undefined
    userData.name = data?.name?.toString().trim() ? data.name : undefined
    userData.surname = data?.surname?.toString().trim() ? data.surname : undefined
    userData.password = data?.password?.toString().trim() ? bcrypt.hashSync(data.password, 10) : undefined
    userData.role = data.role
    userData.tenantId = tenantId
    userData.createdBy = createdId
    userData.exchangeGroup = data?.exchangeGroup
    userData.leverageX = !isNaN(data?.leverageX) ? data.leverageX : undefined
    userData.leverageY = !isNaN(data?.leverageY) ? data.leverageY : undefined
    return userData
  }
  switch (data.role) {
    case constant.ROLE[1]:
      await setUserProperties(userData, data, tenantId, createdId)
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
      await setUserProperties(userData, data, tenantId, createdId)
      userData.limitOfAddMaster = !isNaN(data?.limitOfAddMaster) ? data.limitOfAddMaster : undefined
      userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
      userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
      userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
      userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
      await new UserModel(userData).save()
      return true
    case constant.ROLE[3]:
      await setUserProperties(userData, data, tenantId, createdId)
      userData.limitOfAddUser = !isNaN(data?.limitOfAddUser) ? data.limitOfAddUser : undefined
      userData.insertCustomBet = Object.keys(data).includes('insertCustomBet') ? data.insertCustomBet : undefined
      userData.editBet = Object.keys(data).includes('editBet') ? data.editBet : undefined
      userData.deleteBet = Object.keys(data).includes('deleteBet') ? data.deleteBet : undefined
      await new UserModel(userData).save()
      return true
    case constant.ROLE[4]:
      await setUserProperties(userData, data, tenantId, createdId)
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
    let adminID = ''
    let adminTid = ''
    switch (true) {
      case Boolean(req.superMaster):
        adminID = req.superMaster._id
        adminTid = req.superMaster.tenantId
        break
      case Boolean(req.admins):
        adminID = adminTid = req.admins._id
        break
      default:
        return sendBadRequest(res, messages.somethingGoneWrong)
    }

    const user = await createUser(data, adminTid, adminID)
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    if (user === messages.exchangeNotFound) return sendBadRequest(res, messages.exchangeNotFound)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_BROKER'))
  }
}

// const tenantSchemas = new Map([['tenants', TenantModel]])

export const createMainAdmin = async () => {
  try {
    // todo  for switch db
    // const database = await dbChange('TOKMAY', 'chats')
    // const adminDetails = await database.find({}).toArray()
    // console.log(adminDetails)

    // const database = db.useDb('MT002')
    // const user = database.collection('users')
    // const data = await database.find({})
    // console.log(data)
    // console.log(user, 'ttt')
    // console.log('hii1')
    // const db = await switchDB('entryTenants', tenantSchemas)
    // console.log('hii2')
    // const model = await getDBModel(database, 'tenants')
    // console.log('hii')

    // for (let i = 0; i < config.ROOT_ADMINS.length; i++) {
    //   const adminDetails = await model.findOne({ Domain: config.ROOT_ADMINS_DOMAINS[i] })
    //   if (!adminDetails) return
    //   console.log(adminDetails)
    // }

    // const database = await dbChange('entryTenent', 'users')
    // console.log(database)
    // const adminDetails = await database.find({}).toArray()
    // console.log(adminDetails)
    const admin = await UserModel.findOne({ ID: config.ADMIN_ID })
    if (!admin) {
      const adminData = {
        firstName: 'Super',
        lastName: 'Admin',
        ID: config.ADMIN_ID,
        password: bcrypt.hashSync(config.ADMIN_PASSWORD, 10),
        role: constant.ROLE[0]
      }
      const abc = await new UserModel(adminData).save()
      // await abc.save()
      // const data = abc.ops[0]
      console.log(abc, 'abc')
      // const tenentDb = await dbChange('entryTenent', 'tenants')
      await new TenantModel({
        tenantId: abc.ID,
        Domain: 'Softcolon'
      }).save()
    }
  } catch (e) {
    console.log(e)
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
    const user = await createUser(data, req.superAdmin._id, req.superAdmin._id)
    if (!user) return sendBadRequest(res, messages.adminAlreadyExist)
    if (user === messages.exchangeNotFound) return sendBadRequest(res, messages.exchangeNotFound)
    return sendSuccess(res, {}, messages.adminAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_ADMIN'))
  }
}

// create Super broker
export const createSuperMaster = async (req, res) => {
  try {
    const data = req.body
    const user = await createUser(data, req.admins._id, req.admins._id)
    if (!user) return sendBadRequest(res, messages.brokerAlreadyExist)
    if (user === messages.exchangeNotFound) return sendBadRequest(res, messages.exchangeNotFound)
    return sendSuccess(res, {}, messages.brokerAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_SUPER_BROKER'))
  }
}

// create user
export const createTrader = async (req, res) => {
  try {
    const data = req.body
    let adminDetails = ''
    let TenantId = ''
    switch (true) {
      case Boolean(req.master):
        console.log('1')
        console.log(req.master._id)
        adminDetails = req.master._id
        TenantId = req.master.tenantId
        break
      case Boolean(req.superMaster):
        adminDetails = req.superMaster._id
        TenantId = req.superMaster.tenantId
        break
      default:
        adminDetails = TenantId = req.admins._id
    }
    const user = await createUser(data, TenantId, adminDetails)
    if (!user) return sendBadRequest(res, messages.userAlreadyExist)
    if (user === messages.exchangeNotFound) return sendBadRequest(res, messages.exchangeNotFound)
    return sendSuccess(res, {}, messages.userAdded)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'CREATE_USER'))
  }
}

// user login
export const login = async (req, res) => {
  try {
    const data = req.body
    console.log(data)
    const user = await UserModel.findOne({ ID: data.ID })
    console.log(user)
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

    let adminDetails = ''
    let TenantId = ''
    let adminRole = ''
    switch (true) {
      case Boolean(req.master):
        adminDetails = req.master._id
        adminRole = req.master.role
        TenantId = req.master.tenantId
        break
      case Boolean(req.superMaster):
        adminDetails = req.superMaster._id
        TenantId = req.superMaster.tenantId
        adminRole = req.superMaster.role
        break
      case Boolean(req.admins):
        adminDetails = TenantId = req.admins._id
        adminRole = req.admins.role
        break
      default:
        sendBadRequest(res, messages.somethingGoneWrong)
    }
    const userDetails = await UserModel.findOne({ _id: req.query.id, tenantId: TenantId })
    if (!userDetails) return sendBadRequest(res, messages.userNotFound)
    // const admin = req.user ?? req.superAdmin ?? req.admins ?? req.master ?? req.superMaster
    // if (!(await checkUpdater(admin.role, userDetails?.role))) {
    if (!(await checkUpdater(adminRole, userDetails?.role))) {
      return sendBadRequest(res, messages.YouAreNotAccessibleToDoThis)
    }
    // if (!(await adminIsAccessible(admin._id, userDetails.createdBy))) {
    if (!(await adminIsAccessible(adminDetails, userDetails.createdBy))) {
      return sendBadRequest(res, messages.YouAreNotAuthenticated)
    }
    // const checkForName = await UserModel.findOne({ name: data?.name, tenantId: TenantId })
    // if (checkForName) return sendBadRequest(res, messages.ThisNameIsAlreadyTaken)
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
    // const userDetails = await UserModel.findOne({ _id: req?.user?._id ?? req?.superAdmin?._id ?? req?.admins?._id ?? req?.master?._id ?? req?.superMaster?._id })
    const userDetails = await UserModel.findOne({ _id: req.user._id, tenantId: req.user.tenantId })
    if (!userDetails) return sendBadRequest(res, messages.userNotFound)
    // const checkForName = await UserModel.findOne({ name: data?.name, tenantId: req.user.tenantId })
    // if (checkForName) return sendBadRequest(res, messages.ThisNameIsAlreadyTaken)
    userDetails.name = data?.name
    await userDetails.save()
    return sendSuccess(res, messages.NameUpdated)
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, 'UPDATE_NAME_SELF'))
  }
}
