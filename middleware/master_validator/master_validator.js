import { sendBadRequest, sendBadRequestWith406Code } from '../../utilities/response/index.js'
import messages from '../../utilities/messages.js'
import { UserModel } from '../../modals/index.js'
import logger from '../../utilities/logger.js'
import { validateAccessToken } from '../../helper/accessTokenHelper.js'

export const isSuperMaster = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'SUPER_MASTER')
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
    if (adminDetails.role !== 'SUPER_MASTER') {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.superMaster = adminDetails
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

    logger.error('IS_SUPER_MASTER')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}

export const isMaster = async (req, res, next, type = 1) => {
  try {
    // find token in headers
    const bearerToken = req.headers.authorization
    // if token find then verify
    if (!bearerToken) return sendBadRequestWith406Code(res, messages.authTokenRequired)
    const tokenInfo = await validateAccessToken(String(bearerToken).split(' ')[1], 'MASTER')
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
    if (adminDetails.role !== 'MASTER') {
      return sendBadRequestWith406Code(res, messages.adminNotFound)
    }
    // if (!adminDetails.accessTokenID) return sendBadRequestWith406Code(res, messages.AccessTokenAlreadyInUse)
    // if (adminDetails.accessTokenID !== tokenInfo.accessTokenID) return sendBadRequestWith406Code(res, messages.accessTokenIsNotValid)
    // if (!adminDetails.status) return sendBadRequestWith406Code(res, messages.accountBlocked)
    // if (adminDetails.deleted) return sendBadRequestWith406Code(res, messages.accountDeleted)

    // Attach Admin Info
    req.master = adminDetails
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

    logger.error('IS_MASTER')
    logger.error(e)
    return sendBadRequest(res, messages.somethingGoneWrong)
  }
}
