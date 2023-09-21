import { sendBadRequest, sendBadRequestWith406Code } from '../../utilities/response/index.js'
import messages from '../../utilities/messages.js'
import { UserModel } from '../../modals/index.js'
import logger from '../../utilities/logger.js'
import { validateAccessToken } from '../../helper/accessTokenHelper.js'

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
    if (String(e).includes('jwt expired')) {
      return sendBadRequestWith406Code(res, messages.tokenExpiredError)
    } else if (String(e).includes('invalid token')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    } else if (String(e).includes('jwt malformed')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    } else if (String(e).includes('invalid signature')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    }

    logger.error('IS_SUPER_ADMIN')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
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
    if (!tokenInfo && !tokenInfo._id) return sendBadRequestWith406Code(res, messages.tokenFormatInvalid)

    const adminDetails = await UserModel.findOne(
      { _id: tokenInfo._id },
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
    if (String(e).includes('jwt expired')) {
      return sendBadRequestWith406Code(res, messages.tokenExpiredError)
    } else if (String(e).includes('invalid token')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    } else if (String(e).includes('jwt malformed')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    } else if (String(e).includes('invalid signature')) {
      return sendBadRequestWith406Code(res, messages.invalidToken)
    }

    logger.error('IS_ADMIN')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
