import { sendBadRequest, sendBadRequestWith406Code } from '../../utilities/response/index.js'
import messages from '../../utilities/messages.js'
import { returnTokenError, validateAccessToken } from '../../helper/accessTokenHelper.js'
import { UserModel } from '../../modules/admin/model.js'
import { errorHelper } from '../../helper/errorHelper.js'
import constant from '../../utilities/constant.js'
import { isForAllUser } from '../master_validator/master_validator.js'
import logger from '../../utilities/logger.js'

export const isSuperAdmin = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'SUPER_ADMIN')
    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo._id) return sendBadRequestWith406Code(res, messages.tokenFormatInvalid)

    const adminDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
      {
        _id: 1,
        role: 1
      }
    )

    if (!adminDetails) {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    if (adminDetails.role !== 'SUPER_ADMIN') {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.superAdmin = adminDetails
    // next for using this method only
    next()
  } catch (e) {
    const error = await returnTokenError(e, 'IS_SUPER_ADMIN')
    if (error !== messages.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error)
    } else {
      return sendBadRequest(res, error)
    }
  }
}
export const isSuperAdminWithUser = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'SUPER_ADMIN')
    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo._id) return sendBadRequestWith406Code(res, messages.tokenFormatInvalid)

    const adminDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
      {
        _id: 1,
        role: 1
      }
    )

    if (!adminDetails) {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    if (adminDetails.role !== 'SUPER_ADMIN') {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.superAdmin = adminDetails
    // next for using this method only
    next()
  } catch (e) {
    if (type === 1) {
      return await isForAllUser(req, res, next, type)
    }
    const error = await returnTokenError(e, 'IS_SUPER_ADMIN')
    if (error !== messages.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error)
    } else {
      return sendBadRequest(res, error)
    }
  }
}

export const isAdmin = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'ADMIN')
    // token and token id find n  ext step
    if (!tokenInfo && !tokenInfo?._id) return sendBadRequestWith406Code(res, messages.tokenFormatInvalid)

    const adminDetails = await UserModel.findOne(
      { _id: tokenInfo?._id },
      {
        _id: 1,
        role: 1
      }
    )

    // Admin Does not exist
    if (!adminDetails) return sendBadRequestWith406Code(res, messages.adminNotFound)

    // Admin role is not ADMIN
    if (adminDetails.role !== 'ADMIN') return sendBadRequestWith406Code(res, messages.adminNotFound)

    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.admin = adminDetails
    // next for using this method only
    next()
  } catch (e) {
    const error = await returnTokenError(e, 'IS_ADMIN')
    if (error !== messages.somethingGoneWrong) {
      return sendBadRequestWith406Code(res, error)
    } else {
      return sendBadRequest(res, error)
    }
  }
}

export const checkUpdater = async (parentUser, childUser) => {
  try {
    if (constant?.[parentUser]?.includes(childUser)) {
      return 1
    } else {
      return 0
    }
  } catch (e) {
    logger.log('PARENT_ADMIN_UPDATE_CHILD_USER')
    return 0
  }
}

export const adminIsAccessible = async (admin, updaterId) => {
  try {
    if (admin.equals(updaterId)) {
      return 1
    } else {
      return 0
    }
  } catch (e) {
    logger.log('ACCESS_MIDDLEWARE_ERROR')
    return 0
  }
}
